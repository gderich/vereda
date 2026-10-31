import React from "react";
import { Text, View, Linking, Alert } from "react-native";
import { Page, Button, ui } from "@/components/ui";
const collections = [
  {
    title: "Livro de Mórmon",
    description: "Outro Testamento de Jesus Cristo",
    path: "bofm",
  },
  {
    title: "Velho Testamento",
    description: "Da criação aos profetas",
    path: "ot",
  },
  {
    title: "Novo Testamento",
    description: "A vida de Cristo e o testemunho dos apóstolos",
    path: "nt",
  },
  {
    title: "Doutrina e Convênios",
    description: "Revelações e ensinamentos",
    path: "dc-testament",
  },
  {
    title: "Pérola de Grande Valor",
    description: "Escrituras e declarações de fé",
    path: "pgp",
  },
];
export default function LibraryScreen() {
  return (
    <Page>
      <Text style={ui.eyebrow}>FONTES PARA SUA JORNADA</Text>
      <Text accessibilityRole="header" style={ui.title}>
        Abra as escrituras.
      </Text>
      <Text style={ui.body}>
        Leia na Biblioteca do Evangelho ou no site oficial da Igreja, em
        português.
      </Text>
      {collections.map((c) => (
        <View key={c.path} style={ui.card}>
          <Text style={ui.heading}>{c.title}</Text>
          <Text style={ui.body}>{c.description}</Text>
          <Button
            secondary
            title="Abrir leitura ↗"
            onPress={() =>
              Linking.openURL(
                `https://www.churchofjesuschrist.org/study/scriptures/${c.path}?lang=por`,
              ).catch(() =>
                Alert.alert(
                  "Não foi possível abrir",
                  "Verifique sua conexão e tente novamente.",
                ),
              )
            }
          />
        </View>
      ))}
      <Text style={ui.small}>
        Os links abrem fora do Vereda. O site precisa de internet. As lições,
        perguntas e reflexões salvas no Vereda funcionam offline. Entrar na
        conta da Igreja no serviço oficial não sincroniza o progresso deste app.
      </Text>
    </Page>
  );
}
