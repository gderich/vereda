# Livro de Mórmon offline — Vereda 1.3

## No celular

1. Instale o APK 1.3 (ou posterior). A importação usa `expo-document-picker`, que exige um novo build nativo; reiniciar o Metro não adiciona esse módulo ao APK antigo.
2. Baixe **Livro-de-Mormon.vereda.json** para o celular. Esse é o pacote pessoal convertido; não selecione o PDF original.
3. Abra **Biblioteca → Mórmon → Importar Livro de Mórmon** e selecione o arquivo.
4. Aguarde a confirmação de 15 livros, 239 capítulos e 6.604 versículos. Abra um capítulo; depois de importado, ele funciona em modo avião.

O leitor usa as mesmas preferências de fonte/tema, marcações, registro de leitura e XP da Bíblia. Nos planos, concluir o capítulo também atualiza o plano. Reler não duplica o XP de capítulo.

O texto fica nos arquivos privados do aplicativo. Apenas a referência ao arquivo fica no AsyncStorage. A substituição é validada e gravada antes de trocar essa referência, preservando o exemplar anterior se houver erro. Remover o texto não apaga o progresso ou os favoritos. Desinstalar o app ou limpar seus dados pode remover todos os dados locais; guarde uma cópia do pacote original.

Não existe login nem sincronização com a Conta da Igreja. As marcações da Biblioteca do Evangelho não são importadas. Este projeto é independente.

## Conteúdo e conversão

O pacote pessoal foi convertido do PDF em português de 2015 fornecido pelo usuário. Ele contém os versículos, sem introduções, resumos de capítulos ou notas de rodapé. As palavras e a edição do PDF são preservadas; diferenças de redação com o site atual não são corrigidas silenciosamente.

O PDF e o texto convertido não são publicados neste repositório. O GitHub contém o código do importador e os números de versículos por capítulo. O arquivo `.vereda.json` é disponibilizado separadamente ao dono do exemplar e pode ser importado localmente.

Para reproduzir a conversão desse PDF específico em um computador com Python:

```powershell
python -m pip install PyMuPDF
python .\scripts\import-bom-pdf.py 'C:\caminho\59012_por.pdf' 'C:\caminho\Livro-de-Mormon.vereda.json'
```

O conversor verifica o hash do PDF para evitar aplicar regras de diagramação a outra edição. Lê as colunas na ordem, distingue texto de notas/títulos pelo tamanho e família da fonte, reconstrói palavras divididas por hifens discricionários e verifica a sequência de todos os capítulos e versículos. Não é um conversor genérico de PDFs.

Formato do pacote: `format: vereda-scriptures`, `version: 1`, `collection: bom`, `language: pt-BR`, `edition`, `source`, `books[bookId][chapter]` como arrays de versículos. O app valida todos os 239 capítulos e suas quantidades de versículos antes de salvar. Limite: 6 MB. Nenhum código é executado a partir do arquivo importado.

## Validação

- Testes automatizados: arquivo inválido/incompleto, cancelamento, falta de espaço, falha ao salvar referência, substituição, reinício, remoção, preservação do progresso e APK sem o módulo nativo.
- O leitor e os planos usam o corpus importado sem WebView.
- A verificação de TypeScript e a exportação Android não substituem testar o APK no aparelho.
