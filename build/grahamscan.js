/*! ConvexHullDemo 2019-05-13 */
define(["geom"],function(a){function b(b){function f(a){m.push({lines:[o].concat(a),hull:l.slice()})}function g(a){for(;l.length>1&&!l[l.length-1].minus(l[l.length-2]).isLeftTurn(a.minus(l[l.length-1]));)f([{points:[a,l[l.length-1]],style:c}]),l.pop();0!==l.length&&l[-1]===a||l.push(a),f([])}var h,i,j,k,l=[],m=[],n=[],o={points:[],style:d};if(b.length<3)return l=b,2==b.length&&l.push(b[0]),f([]),m;for(j=1;j<b.length;j++)h=b[j],(h[1]<b[0][1]||h[1]===b[0][1]&&h[0]<b[0][0])&&(b[j]=b[0],b[0]=h);for(i=new a.Vec(b[0]),k=[],j=1;j<b.length;j++)k.push(new a.Vec(b[j]));for(k.sort(function(a,b){var c=a.minus(i),d=b.minus(i);return c.isParallel(d)?0:c.isLeftTurn(d)?-1:1}),f([]),o={points:[i].concat(k).concat([i]),style:d},n.push(i),j=0;j<k.length;j++)n.push(k[j]),n.push(i);for(f({points:n,style:e}),l=[i,k[0],k[1]],f([]),j=2;j<k.length;j++)g(k[j]);return g(i),m}const c={color:"blue",width:2,dash:"dot",name:"Candidate"},d={color:"rgb(200, 200, 200)",width:1,dash:"dash",name:"Skeleton"},e={color:"rgb(150, 150, 255)",width:1,dash:"solid",name:"Sorted radius vectors"};return b});