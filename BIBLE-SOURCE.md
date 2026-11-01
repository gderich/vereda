# Texto bíblico offline

- Edição: Bíblia Almeida Recebida (PorAR), versão 1.7, publicada em 17/03/2017.
- Editor/fonte: https://www.almeidarecebida.org/
- Download: https://www.almeidarecebida.org/files/Almeida-Recebida-%28version-1.7%29.mysql.zip
- Declaração do editor consultada em 01/11/2026: “This Bible (PorAR) is in the Public Domain.”
- Conteúdo: 66 livros, 1.189 capítulos, 31.102 versículos.
- SHA-256 do SQL utilizado: `9de5dfed4583bf3906be85177541fed70af85cda1ee0a5d44eb7c49712e1ebdc`.

O importador `scripts/import-bible.py` analisa as linhas de dados sem executar SQL. Preserva as palavras e a ortografia; apenas desfaz os escapes de strings SQL e organiza livro/capítulo/versículo. O resultado é JSON UTF-8 comprimido com gzip e codificado em base64, decodificado localmente quando o leitor é aberto. Não há download de texto durante o uso.

Esta edição Almeida **não é a edição 2015 da Igreja**. Não inclui notas, títulos ou marcações da Biblioteca do Evangelho. O Livro de Mórmon não foi incorporado: planos e estudos permanecem disponíveis com registro da leitura no exemplar do usuário.

A documentação oficial confirma sincronização de anotações entre a Biblioteca do Evangelho e o site da Igreja. Não foi localizada uma API pública documentada de autorização e sincronização para apps de terceiros. As marcações do Vereda são locais, sem conexão com a Conta da Igreja.

Referências:
- https://www.churchofjesuschrist.org/learn/mobile-applications/gospel-library-user-guide-android?lang=eng
- https://www.churchofjesuschrist.org/learn/mobile-applications/gospel-library-support?lang=eng
