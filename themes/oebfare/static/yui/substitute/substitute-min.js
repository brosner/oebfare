/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 3.0.0pr1
*/
YUI.add("substitute",function(G){var B=G.Lang,D="dump",F=" ",C="{",E="}",A=function(S,H,N){var L,K,J,P,Q,R,O=[],I;for(;;){L=S.lastIndexOf(C);if(L<0){break;}K=S.indexOf(E,L);if(L+1>=K){break;}I=S.substring(L+1,K);P=I;R=null;J=P.indexOf(F);if(J>-1){R=P.substring(J+1);P=P.substring(0,J);}Q=H[P];if(N){Q=N(P,Q,R);}if(B.isObject(Q)){if(!G.dump){Q=Q.toString();}else{if(B.isArray(Q)){Q=G.dump(Q,parseInt(R,10));}else{R=R||"";var M=R.indexOf(D);if(M>-1){R=R.substring(4);}if(Q.toString===Object.prototype.toString||M>-1){Q=G.dump(Q,parseInt(R,10));}else{Q=Q.toString();}}}}else{if(!B.isString(Q)&&!B.isNumber(Q)){Q="~-"+O.length+"-~";O[O.length]=I;}}S=S.substring(0,L)+Q+S.substring(K+1);}for(L=O.length-1;L>=0;L=L-1){S=S.replace(new RegExp("~-"+L+"-~"),"{"+O[L]+"}","g");}return S;};G.substitute=A;B.substitute=A;},"3.0.0pr1",{optional:["dump"]});