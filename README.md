# Vereda

Aplicativo pessoal de acompanhamento de leitura das escrituras em português. Expo SDK 51, React Native 0.74.5, React 18.2, TypeScript e Expo Router. Sem login, backend, assinatura ou limite de leituras.

## Versão 1.2 — leitura nativa e prática diária

- Tema escuro azul profundo com superfícies azuladas, texto creme e detalhes dourados.
- Bíblia offline nativa: 66 livros, 1.189 capítulos e 31.102 versículos da Almeida Recebida 1.7. Fonte, declaração de domínio público e importador documentados em [BIBLE-SOURCE.md](BIBLE-SOURCE.md). Não é a edição da Igreja.
- Leitor com fonte ajustável, modo noite/sépia, capítulos anterior/próximo, versículos marcados e retomada de leitura. Nenhuma WebView.
- 15 XP por capítulo novo, globalmente (ler o mesmo capítulo em outro plano não repete a recompensa). Releituras mantêm a sequência. Planos mantêm seu bônus de conclusão.
- Desafio diário com cinco perguntas em ordem determinada pelo dia. Primeira rodada: 10 XP + 4 por acerto; novas rodadas não repetem XP. Resultado explica as respostas incorretas.
- Missões de ler, praticar e refletir (15 caracteres): bônus diário de 25 XP, resgatável uma vez.
- Seis lições guiadas, reflexões, conquistas, lembrete local e calendário de estudos.
- Sons normalizados, volume 40/80/100%, botão de teste na tela inicial e diagnóstico de módulo ausente, opção desligada ou falha de reprodução.
- Marcações e progresso são locais. A Conta da Igreja ainda **não** está conectada; não foi encontrada uma API pública documentada para sincronizar anotações de terceiros. O acesso oficial continua externo.
- O Livro de Mórmon ainda não tem texto offline incorporado. Sua leitura pode ser registrada a partir do exemplar do usuário; a interface informa a limitação e não apresenta resumos como versículos.

Os efeitos dependem do módulo nativo `expo-av` incluído a partir do APK 1.1. Atualizar somente o JavaScript de um build anterior não acrescenta áudio. Use o botão **Testar áudio** para identificar a situação no aparelho. O código não pede acesso ao microfone.

## Primeira instalação no Windows (PowerShell)

Tenha Git e Node.js instalados (CI usa Node 22). Use uma pasta nova, mantendo a pasta antiga como backup.

```powershell
Set-Location 'C:\Users\Dell'
git clone https://github.com/gderich/vereda.git vereda
Set-Location .\vereda
npm ci
npm run typecheck
npm test
npm run start:dev -- --clear
```

Abra no development build pelo QR Code. Expo Go atual não deve ser presumido compatível com SDK 51. Se surgirem erros de módulos nativos, gere um development build deste mesmo código.

## Atualizações seguintes

Na pasta clonada, execute:

```powershell
Set-Location 'C:\Users\Dell\vereda'
.\Atualizar.ps1
```

O script usa `git pull --ff-only`, instala o lockfile e inicia o Metro. Ele interrompe se houver alterações locais, preservando seu trabalho. Mudanças no GitHub não substituem automaticamente arquivos de uma pasta antiga que não foi clonada.

## APK que abre sem PC

O perfil `preview` está configurado como APK release sem development client:

```powershell
npx eas-cli build --platform android --profile preview
```

Autentique-se na sua conta EAS quando solicitado. O projeto continua associado ao ID EAS fornecido no arquivo original. Baixe o APK pelo link retornado ao concluir. Não publique senhas, tokens ou keystores no repositório.

Em caso de falha, abra o build, expanda **Run gradlew** e obtenha o trecho **What went wrong** e as linhas anteriores. Nenhuma causa de Gradle foi confirmada porque o ZIP não trouxe esses logs.

Para development build:

```powershell
npx eas-cli build --platform android --profile development
```

## Validação

```powershell
npm run typecheck
npm test
npx expo export --platform android --output-dir dist-check
```

Os testes incluem regras de progresso, compatibilidade com perfis antigos, renderização de telas e fluxo de uma lição com tentativa incorreta, reflexão e recompensa. Os testes de interface usam adaptadores simulados para módulos nativos; precisam ser complementados pela verificação em um aparelho.

GitHub Actions executa os mesmos checks a cada push. Não publica APK automaticamente nem usa credenciais EAS. Não há configuração de OTA neste projeto.

## Correções desta revisão

Importação e implementação da tela inicial; rota `index` em minúsculas; remoção da rota premium inexistente; React Compiler desativado; Metro SVG configurado para Expo; splash e hidratação de armazenamento; comentário JSX que virava texto solto; início de planos; seleção de capítulos limitada ao plano; planos temáticos corrigidos; prevenção de recompensas repetidas; nível calculado a partir do XP; datas locais para a sequência; notificações locais sem token push; remoção de dados de submissão de terceiros no EAS.

As chaves de armazenamento anteriores foram preservadas para não apagar progresso. A desinstalação do aplicativo pode apagar dados locais.
