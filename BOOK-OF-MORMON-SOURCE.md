# Livro de Mórmon incorporado

Fonte: PDF `59012_por.pdf`, em português, edição de 2015, enviado pelo proprietário do projeto. O usuário solicitou explicitamente sua incorporação direta ao aplicativo após a conversão para leitura pessoal offline.

- PDF original SHA-256: `26f4a71dd18049da61de9136724492a46dce3a0fce2436a26be26802c6fc3d57`.
- Pacote convertido SHA-256: `c9cf8f8515a78802a5464bc59d8fa9d1acabac3768114ad9eb9b289391ff6d43`.
- Conteúdo: 15 livros, 239 capítulos, 6.604 versículos.
- O PDF identifica © 1997, 2015 Intellectual Reserve, Inc., com todos os direitos reservados. A integração não altera os créditos nem atribui uma nova licença ao texto.
- Não inclui introduções, títulos explicativos, notas de rodapé ou ilustrações. As grafias da edição do PDF são preservadas.
- `src/data/bookOfMormonPayload.ts` contém o pacote JSON comprimido com gzip/base64, carregado e validado sob demanda.
- O app não baixa capítulos da internet ao abrir a leitura e não faz login na Conta da Igreja.

A extração foi conferida estruturalmente em todos os capítulos. A comparação com 238 capítulos do site oficial identificou títulos introdutórios a excluir e dez diferenças de redação/grafia em relação à edição atual do site, preservadas como no PDF. Helamã 16 não respondeu à conferência online; sua sequência foi validada no PDF. Não confundir contagem estrutural ou comparação automática com revisão editorial integral.
