/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 3.0.0pr1
*/
YUI.add("dump",function(G){var B=G.Lang,C="{...}",F="f(){...}",A=", ",D=" => ",E=function(L,K){var I,H,J=[];if(!B.isObject(L)){return L+"";}else{if(L instanceof Date||("nodeType" in L&&"tagName" in L)){return L;}else{if(B.isFunction(L)){return F;}}}K=(B.isNumber(K))?K:3;if(B.isArray(L)){J.push("[");for(I=0,H=L.length;I<H;I=I+1){if(B.isObject(L[I])){J.push((K>0)?B.dump(L[I],K-1):C);}else{J.push(L[I]);}J.push(A);}if(J.length>1){J.pop();}J.push("]");}else{J.push("{");for(I in L){if(G.Object.owns(L,I)){J.push(I+D);if(B.isObject(L[I])){J.push((K>0)?B.dump(L[I],K-1):C);}else{J.push(L[I]);}J.push(A);}}if(J.length>1){J.pop();}J.push("}");}return J.join("");};G.dump=E;B.dump=E;},"3.0.0pr1");