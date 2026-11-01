import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable } from "react-native";
import { Page, Button, ui, colors } from "@/components/ui";
import { ALL_BOOKS, getBook } from "@/data/books";
import { chapterUrl } from "@/data/scriptureLinks";
import ScriptureReader from "@/components/ScriptureReader";
import { useUserStore } from "@/store/userStore";
import ScriptureImport from "@/components/ScriptureImport";
import { useScriptureStore, loadPersonalScriptures } from "@/store/scriptureStore";
export default function LibraryScreen() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"new" | "old" | "bom" | "saved">("new");
  const [selected, setSelected] = useState<string | null>(null);
  const [reading, setReading] = useState<{ url: string; title: string } | null>(
    null,
  );
  const user = useUserStore();
  const pack = useScriptureStore(s => s.pack);
  useEffect(() => { void loadPersonalScriptures(); }, []);
  function open(id: string, ch: number) {
    const url = chapterUrl(id, ch);
    if (url) setReading({ url, title: `${getBook(id)?.name} ${ch}` });
  }
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const books = ALL_BOOKS.filter(
    (b) => b.testament === tab && normalize(b.name).includes(normalize(query)),
  );
  return (
    <Page>
      {reading && (
        <ScriptureReader {...reading} onClose={() => setReading(null)} />
      )}
      <Text style={ui.eyebrow}>SUA BIBLIOTECA</Text>
      <Text accessibilityRole="header" style={ui.title}>
        Leia. Marque. Volte.
      </Text>
      <Text style={ui.body}>
        Bíblia completa offline · Almeida Recebida. +15 XP por capítulo novo;
        releituras mantêm sua sequência.
      </Text>
      {user.lastChapter && (
        <Button
          title={`Continuar · ${getBook(user.lastChapter.bookId)?.name} ${user.lastChapter.chapter}`}
          onPress={() =>
            open(user.lastChapter!.bookId, user.lastChapter!.chapter)
          }
        />
      )}
      <View style={ui.row}>
        {(
          [
            ["new", "Novo"],
            ["old", "Velho"],
            ["bom", "Mórmon"],
            ["saved", "Marcados"],
          ] as const
        ).map(([key, label]) => (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === key }}
            onPress={() => {
              setTab(key);
              setSelected(null);
            }}
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: tab === key ? colors.green : colors.surface,
            }}
          >
            <Text
              style={{
                color: tab === key ? colors.night : colors.ink,
                fontWeight: "700",
              }}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === "saved" ? (
        <>
          {user.bookmarks.length === 0 ? (
            <Text style={ui.body}>
              Toque nos versículos durante a leitura para guardá-los aqui.
            </Text>
          ) : (
            user.bookmarks.map((key) => {
              const [id, ch, verse] = key.split(":");
              return (
                <View key={key} style={ui.card}>
                  <Text style={ui.heading}>
                    {getBook(id)?.name} {ch}:{verse}
                  </Text>
                  <Button
                    secondary
                    title="Abrir capítulo marcado"
                    onPress={() => open(id, Number(ch))}
                  />
                </View>
              );
            })
          )}
        </>
      ) : (
        <>
          <TextInput
            accessibilityLabel="Buscar livro"
            placeholder="Buscar livro…"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={[ui.input, { minHeight: 52 }]}
          />
          {tab === "bom" && (
            <ScriptureImport />
          )}
          {books.length === 0 && (
            <Text style={ui.body}>Nenhum livro encontrado.</Text>
          )}
          {books.map((book) => (
            <View style={ui.card} key={book.id}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: selected === book.id }}
                onPress={() =>
                  setSelected(selected === book.id ? null : book.id)
                }
                style={{ paddingVertical: 8 }}
              >
                <Text style={ui.heading}>
                  {book.name} {selected === book.id ? "−" : "+"}
                </Text>
                <Text style={ui.small}>
                  {book.chapters} capítulos ·{" "}
                  {book.testament === "bom" && !pack
                    ? "Importe seu exemplar"
                    : "Disponível offline"}
                </Text>
              </Pressable>
              {selected === book.id && (
                <View style={ui.row}>
                  {Array.from({ length: book.chapters }, (_, i) => (
                    <Pressable
                      key={i}
                      accessibilityRole="button"
                      accessibilityLabel={`${book.name} ${i + 1}`}
                      onPress={() => open(book.id, i + 1)}
                      style={{
                        minWidth: 48,
                        minHeight: 48,
                        borderRadius: 12,
                        backgroundColor: user.readingLog[`${book.id}:${i + 1}`]
                          ? colors.pale
                          : colors.paper,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: colors.ink }}>
                        {i + 1}
                        {user.readingLog[`${book.id}:${i + 1}`] ? " ✓" : ""}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}
        </>
      )}
    </Page>
  );
}
