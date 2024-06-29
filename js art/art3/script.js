"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const S6=Math.sin(Math.PI/3);
const CSIZE=360;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<2; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.ctx=c.getContext("2d");
  c.ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  c.ctx.globalCompositeOperation="destination-over";
  c.ctx.lineWidth=0;
  container.append(c);
}

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=container.style.height=D+"px";
  for (let i=0; i<container.children.length; i++) {
    let canv=container.children.item(i);
    canv.style.width=canv.style.height=D+"px";
  }
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=20+80*Math.random();
    this.GK1=20+80*Math.random();
    this.BK1=20+80*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

const EDGE=160; //CSIZE/3;
const d=EDGE/2/Math.pow(3,0.5);
const x0=EDGE/2;
const y0=d;

function Point() {
  this.randomize=()=>{
this.K1=20+60*Math.random();
    this.K2=TP*Math.random();
  }
  this.randomize();
  this.setAngle=()=>{
this.a=TP/4+(TP/3-0.001)*(1+Math.sin(this.K2+t/this.K1))/2;
  }
  this.setLocation=(a)=>{
    if (a>TP) a%=TP;
    if (a<TP/4) {
      let dr=d/Math.cos(a-TP/12);
      this.x=x0+dr*Math.cos(a);
      this.y=y0+dr*Math.sin(a);
    } else if (a<7*TP/12) {
      let dr=d/Math.cos(a-5*TP/12);
      this.x=x0+dr*Math.cos(a);
      this.y=y0+dr*Math.sin(a);
    } else if (a<11*TP/12) {
      let dr=d/Math.cos(a-9*TP/12);
      this.x=x0+dr*Math.cos(a);
      this.y=y0+dr*Math.sin(a);
    } else if (a<=TP) {
      let dr=d/Math.cos(a-TP/12);
      this.x=x0+dr*Math.cos(a);
      this.y=y0+dr*Math.sin(a);
    }
  }
}

var cycle=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  container.append(canv1);
  color.randomize();
  p1.randomize();
  p2.randomize();
  p3.randomize();
  K1=1200+1200*Math.random();
  KD2=TP*Math.random();
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var DUR=400;
var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  draw();
  if (t%DUR==0) {
    c=0;
    cycle();
  }
  requestAnimationFrame(animate);
}

var p1=new Point();
var p2=new Point();
var p3=new Point();

var K1=1200+1200*Math.random();

var locate=()=>{
  p1.setAngle();
  p1.setLocation(p1.a);
  p2.setAngle();
  p2.setLocation(TP/3+p2.a);
  p3.setAngle();
  p3.setLocation(2*TP/3+p3.a);
}

var dash1;
var dash2;
var KD2=TP*Math.random();

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dm60=new DOMMatrix([0.5,S6,-S6,0.5,0,0]);
const dm120=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
const dmky=new DOMMatrix([1,0,0,1/3,0,0]);
const dmfky=new DOMMatrix([1,0,0,-1/3,0,0]);
const dmrp=new DOMMatrix([-1,0,0,-1,0,0]);	// hex flip

var draw=()=>{
  let ctx=container.lastChild.ctx;
  locate();
  let p=new Path2D();
  p.moveTo(p1.x,p1.y);
  p.bezierCurveTo(x0,y0,x0,y0,p2.x,p2.y);
  p.bezierCurveTo(x0,y0,x0,y0,p3.x,p3.y);
  p.bezierCurveTo(x0,y0,x0,y0,p1.x,p1.y);

  const getHex=(path)=>{
    let hex=new Path2D(path);
    hex.addPath(path,dm60);
    hex.addPath(path,dm120);
    hex.addPath(hex,dmrp);	// flip
    return hex;
  }

  let pn=new Path2D();	// single kite 
  pn.addPath(p,dmky);	// compress y
  pn.addPath(pn,dmy);	// flip y

  const drc=dmfky.multiply(dm120);
  const dmos=new DOMMatrix([1,0,0,1,3*EDGE/2,S6*EDGE/3]);
  const drc2=dmos.multiply(drc);
  const drc3=dmos.multiply(dmy.multiply(drc));

  let l2set=new Path2D();	// dual kite
  l2set.addPath(p,drc2);	// triangle
  l2set.addPath(p,drc3);	// kite
  var pkite=new Path2D(l2set);
  l2set.addPath(l2set,dmy);	// duplicate y, dual kite

  const drd=dmx.multiply(dmfky.multiply(dm60));
  const drd2=dmos.multiply(drd);
  const drd3=dmy.multiply(drd2);
  let pn3=new Path2D();
  pn3.addPath(p,drd2);
  pn3.addPath(p,drd3);
  let l3set=new Path2D(pn3);	// triple kite
  const dmos3=new DOMMatrix([1,0,0,1,0,-2*S6*EDGE/3]);
  const dmos4=new DOMMatrix([1,0,0,1,0,2*S6*EDGE/3]);
  l3set.addPath(pn3,dmos3);
  l3set.addPath(pn3,dmos4);

  let l4set=new Path2D();	// 4-kite, from pn
  const dm41=new DOMMatrix([1,0,0,1,3*EDGE/2,S6*EDGE/3]);
  const dm42=new DOMMatrix([1,0,0,1,3*EDGE/2,S6*EDGE]);
  l4set.addPath(pn,dm41);
  l4set.addPath(pn,dm42);
  l4set.addPath(l4set,dmy);

  let l5set=new Path2D();
  const dm5a=(()=>{
    let dma=[];
    for (let i=0; i<5; i++) dma.push(new DOMMatrix([1,0,0,1,3*EDGE/2,(-5+2*i)*S6*EDGE/3]));
    return dma;
  })();
  for (let i in dm5a) l5set.addPath(pkite,dm5a[i]);

  ctx.lineWidth=0.01+3*c/DUR;

  let la=[getHex(pn),getHex(l2set),getHex(l3set),getHex(l4set),getHex(l5set)];
  let pf=new Path2D();
  for (let i in la) {
    ctx.strokeStyle=color.getRGB(i/2);
    ctx.stroke(la[i]);
    pf.addPath(la[i]);
  }

  ctx.strokeStyle="#00000010";
  ctx.lineWidth=6;
  ctx.stroke(pf);
}

onresize();

start();