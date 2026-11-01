#!/usr/bin/env python3
"""Convert the user-owned Portuguese 2015 PDF to a personal Vereda JSON pack.

Requires PyMuPDF. The PDF and generated pack must remain outside the public repo.
This parser intentionally targets the typography of 59012_por.pdf, not arbitrary PDFs.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path
import fitz

BOOKS = [('1ne',22),('2ne',33),('jac',7),('enos',1),('jaro',1),('omni',1),('wom',1),('mos',29),('alma',63),('hela',16),('3ne',30),('4ne',1),('morm',9),('ether',15),('moro',10)]


def convert(source):
    expected_sha = '26f4a71dd18049da61de9136724492a46dce3a0fce2436a26be26802c6fc3d57'
    if hashlib.sha256(Path(source).read_bytes()).hexdigest() != expected_sha:
        raise ValueError('This converter targets the verified 2015 Portuguese PDF only.')
    doc = fitz.open(source)
    books = {}
    book_index = -1
    chapter = 0
    verse = 0
    text = ''
    errors = []
    page_refs = {}
    waiting = True
    section_intro = False
    expected_counts = json.loads((Path(__file__).resolve().parents[1] / 'src/data/bomVerseCounts.json').read_text())
    prefix = ''

    def finish():
        nonlocal text
        if verse and book_index >= 0:
            value = re.sub(r'\s+', ' ', text).strip()
            # Soft hyphens indicate discretionary line breaks; hard hyphens stay.
            value = value.replace('\xad', '')
            target = books[BOOKS[book_index][0]][str(chapter)]
            if verse != len(target) + 1 or not value:
                errors.append(f'{BOOKS[book_index][0]} {chapter}:{verse}: sequence/empty')
            target.append(value)
        text = ''

    for pn in range(24, min(644, len(doc))):
        lines = [l for b in doc[pn].get_text('dict')['blocks'] for l in b.get('lines', [])]
        titles = [s for l in lines for s in l['spans'] if 20 < s['size'] < 25]
        if titles:
            title_y = min(s['bbox'][1] for s in titles)
            before = [l for l in lines if l['bbox'][1] < title_y]
            after = [l for l in lines if l['bbox'][1] >= title_y]
            order = lambda l: (l['bbox'][0] >= 190, l['bbox'][1], l['bbox'][0])
            lines = sorted(before, key=order) + [None] + sorted(after, key=order)
        else:
            lines.sort(key=lambda l: (l['bbox'][0] >= 190, l['bbox'][1], l['bbox'][0]))
        for line in lines:
            if line is None:
                finish()
                book_index += 1
                if book_index >= len(BOOKS): raise ValueError('Unexpected book')
                books[BOOKS[book_index][0]] = {}
                chapter, verse, waiting = 0, 0, True
                section_intro = False
                continue
            if line['bbox'][1] < 38 and all(s['size'] < 10 for s in line['spans']): continue  # running header
            spans = line['spans']
            raw = ''.join(s['text'] for s in spans).strip()
            ch = re.fullmatch(r'CAPÍTULO (\d+)', raw)
            if ch:
                finish()
                chapter, verse = int(ch[1]), 0
                section_intro = False
                books[BOOKS[book_index][0]][str(chapter)] = []
                page_refs[f'{BOOKS[book_index][0]}:{chapter}'] = pn + 1
                continue
            big = [s for s in spans if s['size'] > 25]
            if big:
                chapter = 1
                books[BOOKS[book_index][0]].setdefault('1', [])
                page_refs[f'{BOOKS[book_index][0]}:1'] = pn + 1
                verse, waiting, prefix = 1, False, big[0]['text']
                continue
            if waiting or section_intro: continue
            # Body is Roman ~10.4 pt. Summaries are italic; footnotes <=9.2 pt.
            body = ''.join(s['text'] for s in spans if s['font'].endswith('-Roman') and 10 <= s['size'] < 11)
            body = body.strip()
            if not body or body == 'FIM': continue
            if verse and chapter and verse == expected_counts[BOOKS[book_index][0]][chapter - 1] and re.match(r'^(Palavras (?:de|que) |Registro de Zênife|Relato (?:d[aeo]s?|sobre) |Mandamentos de |Os mandamentos de |(?:A profecia|Profecia) de |Jesus Cristo mostrou-se |A segunda epístola de )', body):
                finish()
                verse = 0
                section_intro = True
                continue
            if prefix:
                body = prefix + body
                prefix = ''
            m = re.match(r'^(\d+)\s+(.*)', body)
            if m:
                finish()
                verse = int(m[1])
                body = m[2]
            if not verse:
                verse = 1  # Printed chapter openings omit the numeral 1.
            # Keep true lexical hyphens, remove only discretionary hyphens.
            if text.endswith('\xad'):
                text = text[:-1] + body
            elif text.endswith('-'):
                text += body
            else:
                text += (' ' if text else '') + body
        if pn == 643: finish()
    for bid, count in BOOKS:
        chapters = books.get(bid,{})
        if list(chapters) != list(map(str,range(1,count+1))): errors.append(f'{bid}: chapter sequence')
    for bid, counts in expected_counts.items():
        actual = [len(books.get(bid, {}).get(str(i), [])) for i in range(1, len(counts) + 1)]
        if actual != counts: errors.append(f'{bid}: verse counts differ')
    if sum(len(v) for c in books.values() for v in c.values()) != 6604: errors.append('Expected 6604 verses')
    if errors: raise ValueError('\n'.join(errors[:40]))
    return {
        'format': 'vereda-scriptures', 'version': 1, 'collection': 'bom', 'language': 'pt-BR',
        'edition': 'Livro de Mórmon · português · edição 2015',
        'source': 'PDF fornecido pelo usuário · 59012_por.pdf',
        'sourceSha256': hashlib.sha256(Path(source).read_bytes()).hexdigest(),
        'books': books,
    }, page_refs

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('pdf'); parser.add_argument('output')
    args=parser.parse_args()
    pack,pages=convert(args.pdf)
    dest=Path(args.output);dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(pack,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print(json.dumps({'books':len(pack['books']),'chapters':sum(len(c) for c in pack['books'].values()),'verses':sum(len(v) for c in pack['books'].values() for v in c.values()),'output':str(dest)},ensure_ascii=False))
