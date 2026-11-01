"""Original gentle plucked notes: no recordings or third-party sound assets."""
import math, wave, struct
from pathlib import Path
RATE=44100
OUT=Path(__file__).resolve().parents[1]/'assets/sounds'
# A warm pentatonic palette, a soft neutral retry, and a short resolution.
CUES={'correct':[(0,523.25,.45),(.12,659.25,.4)],'retry':[(0,392,.38)],'complete':[(0,392,.65),(.14,523.25,.62),(.28,659.25,.7)]}
for name,notes in CUES.items():
 length=max(t+d for t,_,d in notes)+.2
 data=[0.0]*int(length*RATE)
 for start,freq,duration in notes:
  for j in range(int(duration*RATE)):
   t=j/RATE; attack=min(1,t/.018);release=min(1,(duration-t)/.12)
   env=attack*release*math.exp(-4*t/duration)
   tone=math.sin(2*math.pi*freq*t)+.16*math.sin(2*math.pi*freq*2*t)+.04*math.sin(2*math.pi*freq*3*t)
   k=int(start*RATE)+j;data[k]+=env*tone
 # One quiet short room reflection; no sharp onset or buzzer.
 delay=int(.065*RATE)
 dry=data[:]
 for j in range(delay,len(data)):data[j]+=.08*dry[j-delay]
 peak=max(abs(v) for v in data)
 data=[v*.48/peak for v in data]
 with wave.open(str(OUT/f'{name}.wav'),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in data))
 print(name,round(length,2),'seconds, peak -6.4 dBFS')
