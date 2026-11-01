import React,{useState} from 'react';
import { Text,View } from 'react-native';
import { useUserStore } from '../store/userStore';
import { useReadingHabitStore } from '../store/readingHabitStore';
import { nextReading,recentReadingDays,READING_CUES } from '../data/readingHabit';
import { getBook } from '../data/books';
import { chapterUrl } from '../data/scriptureLinks';
import { Button,Progress,ui,colors } from './ui';
import ScriptureReader from './ScriptureReader';
export default function ReadingHabitCard(){
 const user=useUserStore(),habit=useReadingHabitStore(),[edit,setEdit]=useState(false);
 const [reading,setReading]=useState<{bookId:string;chapter:number}|null>(null);
 const next=nextReading(user.lastChapter,user.readingLog),days=recentReadingDays(user.readingDays),count=days.filter(d=>d.read).length;
 return <View style={ui.card}>
  {reading&&<ScriptureReader url={chapterUrl(reading.bookId,reading.chapter)!} title={`${getBook(reading.bookId)?.name} ${reading.chapter}`} onClose={()=>setReading(null)}/>}
  <Text style={ui.eyebrow}>UM ENCONTRO COM AS ESCRITURAS</Text>
  <Text style={ui.heading}>{count?'Continue construindo seu hábito':'Um pequeno começo já importa'}</Text>
  <Text style={ui.body}>{habit.cue?`${habit.cue}, vou separar um momento para ler.`:'Comece com alguns versículos. Escolha um momento que combine com a sua rotina.'}</Text>
  <Button title={`Ler · ${getBook(next.bookId)?.name} ${next.chapter}`} onPress={()=>setReading(next)}/>
  <Text style={ui.small}>Pode parar e voltar depois. Registre o capítulo quando terminar de ler.</Text>
  <View style={[ui.row,{justifyContent:'space-between',gap:4}]}>{days.map(d=><View key={d.key} accessible accessibilityLabel={`${d.label}: ${d.read?'leitura registrada':'sem registro'}`} style={{alignItems:'center',gap:5}}><Text style={{color:d.read?colors.green:colors.muted,fontSize:20}}>{d.read?'●':'○'}</Text><Text style={ui.small}>{d.label.replace('.','')}</Text></View>)}</View>
  <Text style={ui.small}>{count} de {habit.weeklyGoal} dias de leitura · últimos 7 dias</Text><Progress value={Math.min(1,count/habit.weeklyGoal)} label="Constância de leitura nos últimos sete dias"/>
  <Text style={ui.small}>{count>=habit.weeklyGoal?'Você alcançou o ritmo que escolheu. Continue no seu tempo.':'Um dia sem ler não apaga o que você já aprendeu.'}</Text>
  <Button secondary title={edit?'Concluir ajuste':'Escolher meu ritmo'} onPress={()=>setEdit(!edit)}/>
  {edit&&<><Text style={ui.heading}>Em qual momento?</Text>{READING_CUES.map(c=><Button key={c} secondary={habit.cue!==c} title={`${c}${habit.cue===c?' ✓':''}`} onPress={()=>habit.setCue(c)}/>)}<Text style={ui.heading}>Quantos dias por semana?</Text><View style={ui.row}>{[3,5,7].map(n=><Button key={n} secondary={habit.weeklyGoal!==n} title={`${n} dias`} onPress={()=>habit.setWeeklyGoal(n)}/>)}</View><Text style={ui.small}>Essa escolha organiza sua rotina. Ela não ativa notificações.</Text></>}
 </View>;
}
