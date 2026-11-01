import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Button, ui, colors } from "./ui";
import { getVerses, referenceFromUrl, BIBLE_EDITION } from "../data/bible";
import { chapterUrl } from "../data/scriptureLinks";
import { getBook } from "../data/books";
import { useUserStore } from "../store/userStore";
import { playSound } from "../services/sounds";
export default function ScriptureReader({
  url,
  title,
  onClose,
  onRead,
}: {
  url: string;
  title: string;
  onClose: () => void;
  onRead?: (book: string, chapter: number) => void;
}) {
  const initial = referenceFromUrl(url);
  const [chapter, setChapter] = useState(initial?.chapter || 1);
  const [result, setResult] = useState<string | null>(null);
  const ref = useRef<ScrollView>(null);
  const user = useUserStore();
  const book = initial ? getBook(initial.bookId) : undefined;
  const verses =
    book && book.testament !== "bom" ? getVerses(book.id, chapter) : [];
  const sepia = user.readerTheme === "sepia";
  const paper = sepia ? "#F0E3C8" : "#102632",
    ink = sepia ? "#342A20" : "#E7E3D9",
    muted = sepia ? "#6D5D46" : "#A8BDC5",
    mark = sepia ? "#E2C886" : "#384B3B";
  function register() {
    if (!book) return;
    const xp = user.recordReading(book.id, chapter);
    setResult(
      xp
        ? `Leitura registrada · +${xp} XP`
        : "Releitura registrada · sequência mantida",
    );
    void playSound("complete");
    onRead?.(book.id, chapter);
  }
  function turn(delta: number) {
    setChapter((c) => c + delta);
    setResult(null);
    ref.current?.scrollTo({ y: 0, animated: false });
  }
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: paper }}>
        <StatusBar style={sepia ? "dark" : "light"} />
        <View
          style={{
            padding: 16,
            gap: 12,
            borderBottomWidth: 1,
            borderBottomColor: muted,
          }}
        >
          <Button secondary title="Voltar ao estudo" onPress={onClose} />
          <Text style={{ color: muted, fontSize: 12, letterSpacing: 2 }}>
            LEITURA {verses.length ? "OFFLINE" : "NO SEU EXEMPLAR"}
          </Text>
          <Text
            accessibilityRole="header"
            style={{ color: ink, fontSize: 24, fontWeight: "700" }}
          >
            {book ? `${book.name} ${chapter}` : title}
          </Text>
          <View style={ui.row}>
            {verses.length > 0 && (
              <>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Diminuir fonte"
                  onPress={() =>
                    useUserStore.setState({
                      readerFont: Math.max(18, user.readerFont - 2),
                    })
                  }
                  style={{ padding: 12 }}
                >
                  <Text style={{ color: ink, fontSize: 18 }}>A−</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Aumentar fonte"
                  onPress={() =>
                    useUserStore.setState({
                      readerFont: Math.min(30, user.readerFont + 2),
                    })
                  }
                  style={{ padding: 12 }}
                >
                  <Text style={{ color: ink, fontSize: 24 }}>A+</Text>
                </Pressable>
              </>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                useUserStore.setState({
                  readerTheme: sepia ? "night" : "sepia",
                })
              }
              style={{ padding: 12 }}
            >
              <Text style={{ color: ink }}>
                {sepia ? "☾ Modo noite" : "☀ Papel sépia"}
              </Text>
            </Pressable>
          </View>
        </View>
        <ScrollView
          key={`${book?.id}:${chapter}`}
          ref={ref}
          contentContainerStyle={{ padding: 24, paddingBottom: 48, gap: 20 }}
        >
          {verses.length ? (
            <>
              <Text style={{ color: muted, fontSize: 12 }}>
                {BIBLE_EDITION}. Toque em um versículo para marcar ou desmarcar.
              </Text>
              {verses.map((verse, i) => {
                const key = `${book!.id}:${chapter}:${i + 1}`,
                  saved = user.bookmarks.includes(key);
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Versículo ${i + 1}. ${saved ? "Marcado. " : ""}${verse}`}
                    accessibilityState={{ selected: saved }}
                    key={i}
                    onPress={() => user.toggleBookmark(key)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      backgroundColor: saved ? mark : "transparent",
                    }}
                  >
                    <Text
                      selectable={false}
                      style={{
                        fontFamily: "serif",
                        fontSize: user.readerFont,
                        lineHeight: user.readerFont * 1.65,
                        color: ink,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: undefined,
                          fontSize: 13,
                          color: muted,
                        }}
                      >
                        {i + 1}{" "}
                      </Text>
                      {verse}
                      {saved ? "  ◆" : ""}
                    </Text>
                  </Pressable>
                );
              })}
              <Text style={{ color: muted, fontSize: 13 }}>
                Fim do capítulo · Confirme a leitura para registrar seu
                progresso.
              </Text>
              <Button
                title={result || "Concluir leitura · +15 XP na primeira vez"}
                onPress={register}
              />
              {result && (
                <Text
                  accessibilityLiveRegion="polite"
                  style={{ color: ink, fontWeight: "700" }}
                >
                  {result}
                </Text>
              )}
              {!onRead && book && (
                <View style={ui.row}>
                  <View style={{ flex: 1 }}>
                    <Button
                      secondary
                      disabled={chapter <= 1}
                      title="← Anterior"
                      onPress={() => turn(-1)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      secondary
                      disabled={chapter >= book.chapters}
                      title="Próximo →"
                      onPress={() => turn(1)}
                    />
                  </View>
                </View>
              )}
              <Text style={{ color: muted, fontSize: 12 }}>
                Texto: almeidarecebida.org · Almeida Recebida, domínio público
                segundo o editor. Esta edição difere da edição da Igreja.
              </Text>
          <Button secondary title="Abrir na Biblioteca do Evangelho ↗" onPress={()=>{const official=book?chapterUrl(book.id,chapter):null;if(official)Linking.openURL(official).catch(()=>Alert.alert('Não foi possível abrir','Verifique sua conexão.'));}}/>
          <Text style={{color:muted,fontSize:12}}>Suas marcações da Conta da Igreja ficam no serviço oficial. As marcações feitas aqui são locais e não são sincronizadas com ele.</Text>
            </>
          ) : (
            <>
              <Text style={{ color: ink, fontSize: 20, lineHeight: 30 }}>
                O texto completo desta obra ainda não está incluído offline.
                Você pode ler no seu exemplar e registrar o capítulo aqui.
              </Text>
              <Text style={{ color: muted, lineHeight: 24 }}>
                Não vamos substituir os versículos por um resumo nem abrir um
                site dentro da tela de leitura.
              </Text>
              <Button
                secondary
                title="Abrir fonte oficial fora do app ↗"
                onPress={() =>
                  Linking.openURL(url).catch(() =>
                    Alert.alert(
                      "Não foi possível abrir",
                      "Verifique a conexão.",
                    ),
                  )
                }
              />
              {book && (
                <Button
                  title={result || "Li no meu exemplar · Registrar"}
                  onPress={() =>
                    Alert.alert(
                      "Confirmar leitura",
                      `Você leu ${book.name} ${chapter}?`,
                      [
                        { text: "Ainda não", style: "cancel" },
                        { text: "Sim, registrar", onPress: register },
                      ],
                    )
                  }
                />
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
