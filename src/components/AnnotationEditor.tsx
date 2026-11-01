import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Button, colors, ui } from './ui';
import { MARK_COLORS, MARK_STYLES, MarkColor, MarkStyle, wordsWithOffsets } from '../data/annotations';
import { useAnnotationStore } from '../store/annotationStore';
import { useUserStore } from '../store/userStore';
export default function AnnotationEditor({reference,title,text,onClose}:{reference:string;title:string;text:string;onClose:()=>void}) {
  const words=useMemo(()=>wordsWithOffsets(text),[text]);
  const [range,setRange]=useState<[number,number]|null>(null),[anchor,setAnchor]=useState<number|null>(null);
  const [color,setColor]=useState<MarkColor>('gold'),[style,setStyle]=useState<MarkStyle>('highlight'),[note,setNote]=useState('');
  const {marks,save,remove}=useAnnotationStore();const user=useUserStore();
  const existing=marks.filter(m=>m.reference===reference);
  const quote=range?text.slice(range[0],range[1]):'';
  function pick(i:number){if(anchor===null){setAnchor(i);setRange([words[i].start,words[i].end]);}else{setRange([words[Math.min(i,anchor)].start,words[Math.max(i,anchor)].end]);setAnchor(null);}}
  return <View style={{flex:1,backgroundColor:colors.paper}}>
    <View style={{padding:16}}><Button secondary title="Voltar à leitura" onPress={onClose}/></View>
    <ScrollView contentContainerStyle={{padding:20,gap:20,paddingBottom:48}} keyboardShouldPersistTaps="handled">
      <Text style={ui.eyebrow}>SUAS MARCAÇÕES</Text><Text accessibilityRole="header" style={ui.heading}>{title}</Text>
      <Text style={ui.body}>{anchor===null?'Toque na primeira palavra e depois na última para selecionar um trecho.':'Agora toque na última palavra. Para marcar uma palavra só, toque nela novamente.'}</Text>
      <Text style={{fontFamily:'serif',fontSize:22,lineHeight:38,color:colors.ink}}>{words.map((w,i)=><Text key={w.start} accessibilityRole="button" accessibilityLabel={`Selecionar palavra ${i+1}: ${w.text}`} onPress={()=>pick(i)} style={range&&w.start>=range[0]&&w.end<=range[1]?{backgroundColor:'#A9CFEF',color:'#172B35'}:undefined}>{w.text}{i<words.length-1?' ':''}</Text>)}</Text>
      <Button secondary title="Selecionar versículo inteiro" onPress={()=>{setRange([0,text.length]);setAnchor(null);}}/>
      <Text accessibilityLiveRegion="polite" style={ui.small}>{quote?`Trecho: “${quote}”`:'Nenhum trecho selecionado.'}</Text>
      <Text style={ui.heading}>Cor</Text><View style={ui.row}>{Object.entries(MARK_COLORS).map(([id,c])=><Pressable key={id} accessibilityRole="radio" accessibilityState={{checked:color===id}} accessibilityLabel={`Cor ${c.name}`} onPress={()=>setColor(id as MarkColor)} style={{padding:12,borderRadius:12,backgroundColor:c.fill,borderWidth:3,borderColor:color===id?colors.white:'transparent'}}><Text style={{color:'#172B35',fontWeight:'700'}}>{c.name}{color===id?' ✓':''}</Text></Pressable>)}</View>
      <Text style={ui.heading}>Estilo</Text><View style={ui.row}>{MARK_STYLES.map(s=><Button key={s.id} secondary={style!==s.id} title={s.name} onPress={()=>setStyle(s.id)}/>)}</View>
      {quote?<Text style={{fontSize:20,lineHeight:30,color:style==='highlight'?'#172B35':MARK_COLORS[color].night,backgroundColor:style==='highlight'?MARK_COLORS[color].fill:'transparent',textDecorationLine:style==='underline'?'underline':'none',fontWeight:style==='bold'?'700':'400',padding:12}}>{quote}</Text>:null}
      <TextInput value={note} onChangeText={setNote} maxLength={500} multiline placeholder="O que esse trecho ensina a você? (opcional)" placeholderTextColor={colors.muted} accessibilityLabel="Nota sobre o trecho" style={ui.input}/>
      <Button disabled={!range} title="Salvar marcação" onPress={()=>{if(range&&save(reference,text,range[0],range[1],color,style,note))onClose();else Alert.alert('Selecione um trecho','Toque na primeira e na última palavra.');}}/>
      <Button secondary title={user.bookmarks.includes(reference)?'Remover versículo dos favoritos':'Guardar versículo nos favoritos'} onPress={()=>user.toggleBookmark(reference)}/>
      {existing.length>0&&<Text style={ui.heading}>Marcações neste versículo</Text>}
      {existing.map(m=><View key={m.id} style={ui.card}><Text style={[ui.body,{color:MARK_COLORS[m.color].night}]}>{m.quote}</Text>{m.note?<Text style={ui.body}>{m.note}</Text>:null}<Button secondary title="Editar esta marcação" onPress={()=>{setRange([m.start,m.end]);setColor(m.color);setStyle(m.style);setNote(m.note);setAnchor(null);}}/><Button secondary title="Excluir esta marcação" onPress={()=>Alert.alert('Excluir marcação?','Apenas este trecho e sua nota serão removidos.',[{text:'Cancelar',style:'cancel'},{text:'Excluir',style:'destructive',onPress:()=>remove(m.id)}])}/></View>)}
    </ScrollView>
  </View>;
}
