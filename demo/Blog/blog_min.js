
if(typeof Jemplate=='undefined'){Jemplate=function(){this.init.apply(this,arguments);};}
if(!Jemplate.templateMap)
Jemplate.templateMap={};Jemplate.process=function(){var jemplate=new Jemplate();return jemplate.process.apply(jemplate,arguments);}
proto=Jemplate.prototype;proto.init=function(config){this.config=config||{AUTO_RESET:true,BLOCKS:{},CONTEXT:null,DEBUG_UNDEF:false,DEFAULT:null,ERROR:null,EVAL_JAVASCRIPT:false,FILTERS:{},INCLUDE_PATH:[''],INTERPOLATE:false,OUTPUT:null,PLUGINS:{},POST_PROCESS:[],PRE_PROCESS:[],PROCESS:null,RECURSION:false,STASH:null,TOLERANT:null,VARIABLES:{},WRAPPER:[]};}
proto.process=function(template,data,output){var context=this.config.CONTEXT||new Jemplate.Context();context.config=this.config;context.stash=this.config.STASH||new Jemplate.Stash();context.stash.__config__=this.config;context.__filter__=new Jemplate.Filter();context.__filter__.config=this.config;var result;var proc=function(input){try{result=context.process(template,input);}
catch(e){if(!String(e).match(/Jemplate\.STOP\n/))
throw(e);result=e.toString().replace(/Jemplate\.STOP\n/,'');}
if(typeof output=='undefined')
return result;if(typeof output=='function'){output(result);return;}
if(typeof(output)=='string'||output instanceof String){if(output.match(/^#[\w\-]+$/)){var id=output.replace(/^#/,'');var element=document.getElementById(id);if(typeof element=='undefined')
throw('No element found with id="'+id+'"');element.innerHTML=result;return;}}
else{output.innerHTML=result;return;}
throw("Invalid arguments in call to Jemplate.process");return 1;}
if(typeof data=='function')
data=data();else if(typeof data=='string'){Ajax.get(data,function(r){proc(JSON.parse(r))});return;}
return proc(data);}
if(typeof Jemplate.Context=='undefined')
Jemplate.Context=function(){};proto=Jemplate.Context.prototype;proto.include=function(template,args){return this.process(template,args,true);}
proto.process=function(template,args,localise){if(localise)
this.stash.clone(args);else
this.stash.update(args);var func=Jemplate.templateMap[template];if(typeof func=='undefined')
throw('No Jemplate template named "'+template+'" available');var output=func(this);if(localise)
this.stash.declone();return output;}
proto.set_error=function(error,output){this._error=[error,output];return error;}
proto.filter=function(text,name,args){if(name=='null')
name="null_filter";if(typeof this.__filter__.filters[name]=="function")
return this.__filter__.filters[name](text,args,this);else
throw"Unknown filter name ':"+name+"'";}
if(typeof Jemplate.Filter=='undefined'){Jemplate.Filter=function(){};}
proto=Jemplate.Filter.prototype;proto.filters={};proto.filters.null_filter=function(text){return'';}
proto.filters.upper=function(text){return text.toUpperCase();}
proto.filters.lower=function(text){return text.toLowerCase();}
proto.filters.ucfirst=function(text){var first=text.charAt(0);var rest=text.substr(1);return first.toUpperCase()+rest;}
proto.filters.lcfirst=function(text){var first=text.charAt(0);var rest=text.substr(1);return first.toLowerCase()+rest;}
proto.filters.trim=function(text){return text.replace(/^\s+/g,"").replace(/\s+$/g,"");}
proto.filters.collapse=function(text){return text.replace(/^\s+/g,"").replace(/\s+$/g,"").replace(/\s+/," ");}
proto.filters.html=function(text){text=text.replace(/&/g,'&amp;');text=text.replace(/</g,'&lt;');text=text.replace(/>/g,'&gt;');text=text.replace(/"/g,'&quot;');return text;}
proto.filters.html_para=function(text){var lines=text.split(/(?:\r?\n){2,}/);return"<p>\n"+lines.join("\n</p>\n\n<p>\n")+"</p>\n";}
proto.filters.html_break=function(text){return text.replace(/(\r?\n){2,}/g,"$1<br />$1<br />$1");}
proto.filters.html_line_break=function(text){return text.replace(/(\r?\n)/g,"$1<br />$1");}
proto.filters.uri=function(text){return encodeURI(text);}
proto.filters.indent=function(text,args){var pad=args[0];if(!text)return;if(typeof pad=='undefined')
pad=4;var finalpad='';if(typeof pad=='number'||String(pad).match(/^\d$/)){for(var i=0;i<pad;i++){finalpad+=' ';}}else{finalpad=pad;}
var output=text.replace(/^/gm,finalpad);return output;}
proto.filters.truncate=function(text,args){var len=args[0];if(!text)return;if(!len)
len=32;if(text.length<len)
return text;var newlen=len-3;return text.substr(0,newlen)+'...';}
proto.filters.repeat=function(text,iter){if(!text)return;if(!iter||iter==0)
iter=1;if(iter==1)return text
var output=text;for(var i=1;i<iter;i++){output+=text;}
return output;}
proto.filters.replace=function(text,args){if(!text)return;var re_search=args[0];var text_replace=args[1];if(!re_search)
re_search='';if(!text_replace)
text_replace='';var re=new RegExp(re_search,'g');return text.replace(re,text_replace);}
if(typeof Jemplate.Stash=='undefined'){Jemplate.Stash=function(){this.data={};};}
proto=Jemplate.Stash.prototype;proto.clone=function(args){var data=this.data;this.data={};this.update(data);this.update(args);this.data._PARENT=data;}
proto.declone=function(args){this.data=this.data._PARENT||this.data;}
proto.update=function(args){if(typeof args=='undefined')return;for(var key in args){var value=args[key];this.set(key,value);}}
proto.get=function(key){var root=this.data;if(key instanceof Array){for(var i=0;i<key.length;i+=2){var args=key.slice(i,i+2);args.unshift(root);value=this._dotop.apply(this,args);if(typeof value=='undefined')
break;root=value;}}
else{value=this._dotop(root,key);}
if(typeof value=='undefined'){if(this.__config__.DEBUG_UNDEF)
throw("undefined value found while using DEGUG_UNDEF");value='';}
return value;}
proto.set=function(key,value,set_default){if(key instanceof Array){var data=this.get(key[0])||{};key=key[2];}
else{data=this.data;}
if(!(set_default&&(typeof data[key]!='undefined')))
data[key]=value;}
proto._dotop=function(root,item,args){if(typeof item=='undefined'||typeof item=='string'&&item.match(/^[\._]/)){return undefined;}
if((!args)&&(typeof root=='object')&&(!(root instanceof Array)||(typeof item=='number'))&&(typeof root[item]!='undefined')){var value=root[item];if(typeof value=='function')
value=value();return value;}
if(typeof root=='string'&&this.string_functions[item])
return this.string_functions[item](root,args);if(root instanceof Array&&this.list_functions[item])
return this.list_functions[item](root,args);if(typeof root=='object'&&this.hash_functions[item])
return this.hash_functions[item](root,args);if(typeof root[item]=='function')
return root[item].apply(root,args);return undefined;}
proto.string_functions={};proto.string_functions.chunk=function(string,args){var size=args[0];var list=new Array();if(!size)
size=1;if(size<0){size=0-size;for(i=string.length-size;i>=0;i=i-size)
list.unshift(string.substr(i,size));if(string.length%size)
list.unshift(string.substr(0,string.length%size));}
else
for(i=0;i<string.length;i=i+size)
list.push(string.substr(i,size));return list;}
proto.string_functions.defined=function(string){return 1;}
proto.string_functions.hash=function(string){return{'value':string};}
proto.string_functions.length=function(string){return string.length;}
proto.string_functions.list=function(string){return[string];}
proto.string_functions.match=function(string,args){var regexp=new RegExp(args[0],'gm');var list=string.match(regexp);return list;}
proto.string_functions.repeat=function(string,args){var n=args[0]||1;var output='';for(var i=0;i<n;i++){output+=string;}
return output;}
proto.string_functions.replace=function(string,args){var regexp=new RegExp(args[0],'gm');var sub=args[1];if(!sub)
sub='';var output=string.replace(regexp,sub);return output;}
proto.string_functions.search=function(string,args){var regexp=new RegExp(args[0]);return(string.search(regexp)>=0)?1:0;}
proto.string_functions.size=function(string){return 1;}
proto.string_functions.split=function(string,args){var regexp=new RegExp(args[0]);var list=string.split(regexp);return list;}
proto.list_functions={};proto.list_functions.join=function(list,args){return list.join(args[0]);};proto.list_functions.sort=function(list,key){if(typeof(key)!='undefined'&&key!=""){return list.sort(function(a,b){if(a[key]==b[key]){return 0;}
else if(a[key]>b[key]){return 1;}
else{return-1;}});}
return list.sort();}
proto.list_functions.nsort=function(list){return list.sort(function(a,b){return(a-b)});}
proto.list_functions.grep=function(list,args){var regexp=new RegExp(args[0]);var result=[];for(var i=0;i<list.length;i++){if(list[i].match(regexp))
result.push(list[i]);}
return result;}
proto.list_functions.unique=function(list){var result=[];var seen={};for(var i=0;i<list.length;i++){var elem=list[i];if(!seen[elem])
result.push(elem);seen[elem]=true;}
return result;}
proto.list_functions.reverse=function(list){var result=[];for(var i=list.length-1;i>=0;i--){result.push(list[i]);}
return result;}
proto.list_functions.merge=function(list,args){var result=[];var push_all=function(elem){if(elem instanceof Array){for(var j=0;j<elem.length;j++){result.push(elem[j]);}}
else{result.push(elem);}}
push_all(list);for(var i=0;i<args.length;i++){push_all(args[i]);}
return result;}
proto.list_functions.slice=function(list,args){return list.slice(args[0],args[1]);}
proto.list_functions.splice=function(list,args){if(args.length==1)
return list.splice(args[0]);if(args.length==2)
return list.splice(args[0],args[1]);if(args.length==3)
return list.splice(args[0],args[1],args[2]);}
proto.list_functions.push=function(list,args){list.push(args[0]);return list;}
proto.list_functions.pop=function(list){return list.pop();}
proto.list_functions.unshift=function(list,args){list.unshift(args[0]);return list;}
proto.list_functions.shift=function(list){return list.shift();}
proto.list_functions.first=function(list){return list[0];}
proto.list_functions.size=function(list){return list.length;}
proto.list_functions.max=function(list){return list.length-1;}
proto.list_functions.last=function(list){return list.slice(-1);}
proto.hash_functions={};proto.hash_functions.each=function(hash){var list=new Array();for(var key in hash)
list.push(key,hash[key]);return list;}
proto.hash_functions.exists=function(hash,args){return(typeof(hash[args[0]])=="undefined")?0:1;}
proto.hash_functions.keys=function(hash){var list=new Array();for(var key in hash)
list.push(key);return list;}
proto.hash_functions.list=function(hash,args){var what='';if(args)
var what=args[0];var list=new Array();if(what=='keys')
for(var key in hash)
list.push(key);else if(what=='values')
for(var key in hash)
list.push(hash[key]);else if(what=='each')
for(var key in hash)
list.push(key,hash[key]);else
for(var key in hash)
list.push({'key':key,'value':hash[key]});return list;}
proto.hash_functions.nsort=function(hash){var list=new Array();for(var key in hash)
list.push(key);return list.sort(function(a,b){return(a-b)});}
proto.hash_functions.size=function(hash){var size=0;for(var key in hash)
size++;return size;}
proto.hash_functions.sort=function(hash){var list=new Array();for(var key in hash)
list.push(key);return list.sort();}
proto.hash_functions.values=function(hash){var list=new Array();for(var key in hash)
list.push(hash[key]);return list;}
if(typeof Jemplate.Iterator=='undefined'){Jemplate.Iterator=function(object){if(object instanceof Array){this.object=object;this.size=object.length;this.max=this.size-1;}
else if(object instanceof Object){this.object=object;var object_keys=new Array;for(var key in object){object_keys[object_keys.length]=key;}
this.object_keys=object_keys.sort();this.size=object_keys.length;this.max=this.size-1;}}}
proto=Jemplate.Iterator.prototype;proto.get_first=function(){this.index=0;this.first=1;this.last=0;this.count=1;return this.get_next(1);}
proto.get_next=function(should_init){var object=this.object;var index;if(typeof(should_init)!='undefined'&&should_init){index=this.index;}else{index=++this.index;this.first=0;this.count=this.index+1;if(this.index==this.size-1){this.last=1;}}
if(typeof object=='undefined')
throw('No object to iterate');if(this.object_keys){if(index<this.object_keys.length){this.prev=index>0?this.object_keys[index-1]:"";this.next=index<this.max?this.object_keys[index+1]:"";return[this.object_keys[index],false];}}else{if(index<object.length){this.prev=index>0?object[index-1]:"";this.next=index<this.max?object[index+1]:"";return[object[index],false];}}
return[null,true];}
function XXX(msg){if(!confirm(msg))
throw("terminated...");return msg;}
function JJJ(obj){return XXX(JSON.stringify(obj));}
if(!this.Ajax)Ajax={};Ajax.get=function(url,callback){var req=new XMLHttpRequest();req.open('GET',url,Boolean(callback));return Ajax._send(req,null,callback);}
Ajax.post=function(url,data,callback){var req=new XMLHttpRequest();req.open('POST',url,Boolean(callback));req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');return Ajax._send(req,data,callback);}
Ajax._send=function(req,data,callback){if(callback){req.onreadystatechange=function(){if(req.readyState==4){if(req.status==200)
callback(req.responseText);}};}
req.send(data);if(!callback){if(req.status!=200)
throw('Request for "'+url+'" failed with status: '+req.status);return req.responseText;}}
if(window.ActiveXObject&&!window.XMLHttpRequest){window.XMLHttpRequest=function(){return new ActiveXObject((navigator.userAgent.toLowerCase().indexOf('msie 5')!=-1)?'Microsoft.XMLHTTP':'Msxml2.XMLHTTP');};}
if(window.opera&&!window.XMLHttpRequest){window.XMLHttpRequest=function(){this.readyState=0;this.status=0;this.statusText='';this._headers=[];this._aborted=false;this._async=true;this.abort=function(){this._aborted=true;};this.getAllResponseHeaders=function(){return this.getAllResponseHeader('*');};this.getAllResponseHeader=function(header){var ret='';for(var i=0;i<this._headers.length;i++){if(header=='*'||this._headers[i].h==header){ret+=this._headers[i].h+': '+this._headers[i].v+'\n';}}
return ret;};this.setRequestHeader=function(header,value){this._headers[this._headers.length]={h:header,v:value};};this.open=function(method,url,async,user,password){this.method=method;this.url=url;this._async=true;this._aborted=false;if(arguments.length>=3){this._async=async;}
if(arguments.length>3){opera.postError('XMLHttpRequest.open() - user/password not supported');}
this._headers=[];this.readyState=1;if(this.onreadystatechange){this.onreadystatechange();}};this.send=function(data){if(!navigator.javaEnabled()){alert("XMLHttpRequest.send() - Java must be installed and enabled.");return;}
if(this._async){setTimeout(this._sendasync,0,this,data);}else{this._sendsync(data);}}
this._sendasync=function(req,data){if(!req._aborted){req._sendsync(data);}};this._sendsync=function(data){this.readyState=2;if(this.onreadystatechange){this.onreadystatechange();}
var url=new java.net.URL(new java.net.URL(window.location.href),this.url);var conn=url.openConnection();for(var i=0;i<this._headers.length;i++){conn.setRequestProperty(this._headers[i].h,this._headers[i].v);}
this._headers=[];if(this.method=='POST'){conn.setDoOutput(true);var wr=new java.io.OutputStreamWriter(conn.getOutputStream());wr.write(data);wr.flush();wr.close();}
var gotContentEncoding=false;var gotContentLength=false;var gotContentType=false;var gotDate=false;var gotExpiration=false;var gotLastModified=false;for(var i=0;;i++){var hdrName=conn.getHeaderFieldKey(i);var hdrValue=conn.getHeaderField(i);if(hdrName==null&&hdrValue==null){break;}
if(hdrName!=null){this._headers[this._headers.length]={h:hdrName,v:hdrValue};switch(hdrName.toLowerCase()){case'content-encoding':gotContentEncoding=true;break;case'content-length':gotContentLength=true;break;case'content-type':gotContentType=true;break;case'date':gotDate=true;break;case'expires':gotExpiration=true;break;case'last-modified':gotLastModified=true;break;}}}
var val;val=conn.getContentEncoding();if(val!=null&&!gotContentEncoding)this._headers[this._headers.length]={h:'Content-encoding',v:val};val=conn.getContentLength();if(val!=-1&&!gotContentLength)this._headers[this._headers.length]={h:'Content-length',v:val};val=conn.getContentType();if(val!=null&&!gotContentType)this._headers[this._headers.length]={h:'Content-type',v:val};val=conn.getDate();if(val!=0&&!gotDate)this._headers[this._headers.length]={h:'Date',v:(new Date(val)).toUTCString()};val=conn.getExpiration();if(val!=0&&!gotExpiration)this._headers[this._headers.length]={h:'Expires',v:(new Date(val)).toUTCString()};val=conn.getLastModified();if(val!=0&&!gotLastModified)this._headers[this._headers.length]={h:'Last-modified',v:(new Date(val)).toUTCString()};var reqdata='';var stream=conn.getInputStream();if(stream){var reader=new java.io.BufferedReader(new java.io.InputStreamReader(stream));var line;while((line=reader.readLine())!=null){if(this.readyState==2){this.readyState=3;if(this.onreadystatechange){this.onreadystatechange();}}
reqdata+=line+'\n';}
reader.close();this.status=200;this.statusText='OK';this.responseText=reqdata;this.readyState=4;if(this.onreadystatechange){this.onreadystatechange();}
if(this.onload){this.onload();}}else{this.status=404;this.statusText='Not Found';this.responseText='';this.readyState=4;if(this.onreadystatechange){this.onreadystatechange();}
if(this.onerror){this.onerror();}}};};}
if(!window.ActiveXObject&&window.XMLHttpRequest){window.ActiveXObject=function(type){switch(type.toLowerCase()){case'microsoft.xmlhttp':case'msxml2.xmlhttp':return new XMLHttpRequest();}
return null;};}
var JSON=function(){var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},s={'boolean':function(x){return String(x);},number:function(x){return isFinite(x)?String(x):'null';},string:function(x){if(/["\\\x00-\x1f]/.test(x)){x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){var c=m[b];if(c){return c;}
c=b.charCodeAt();return'\\u00'+
Math.floor(c/16).toString(16)+
(c%16).toString(16);});}
return'"'+x+'"';},object:function(x){if(x){var a=[],b,f,i,l,v;if(x instanceof Array){a[0]='[';l=x.length;for(i=0;i<l;i+=1){v=x[i];f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a[a.length]=v;b=true;}}}
a[a.length]=']';}else if(x instanceof Object){a[0]='{';for(i in x){v=x[i];f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a.push(s.string(i),':',v);b=true;}}}
a[a.length]='}';}else{return;}
return a.join('');}
return'null';}};return{copyright:'(c)2005 JSON.org',license:'http://www.crockford.com/JSON/license.html',stringify:function(v){var f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){return v;}}
return null;},parse:function(text){try{return!(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g,'')))&&eval('('+text+')');}catch(e){return false;}}};}();if(typeof(Jemplate)=='undefined')
throw('Jemplate.js must be loaded before any Jemplate template files');Jemplate.templateMap['archive-list.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<ul class="module-list">\n';(function(){var list=stash.get('archives');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['archive']=value;output+='    <li class="module-list-item">';stash.set('index',stash.get(['archive',0,'month',0]));output+='\n        <a href="#archive-';output+=stash.get(['archive',0,'year',0]);output+='-';output+=stash.get(['archive',0,'month',0]);output+='">';output+=stash.get(['months',0,stash.get('index'),0]);output+=' ';output+=stash.get(['archive',0,'year',0]);output+=' (';output+=stash.get(['archive',0,'count',0]);output+=')</a>\n    </li>\n';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='</ul>\n\n<p class="module-more">\n\n';if(stash.get('offset')>0){output+='\n    <a href="javascript:getArchiveList(';output+=stash.get('offset')-stash.get('count');output+=')">&lt;&lt;</a>\n';}
output+='\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n';if(stash.get(['archives',0,'size',0])==stash.get('count')){output+='\n    <a id="more-archives" href="javascript:getArchiveList(';output+=stash.get('offset')+stash.get('count');output+=');">\n    Next...\n    </a>\n';}
output+='\n\n</p>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['archive-nav.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{if(stash.get('next')){stash.set('index',stash.get(['next',0,'month',0]));output+='\n<a href="#archive-';output+=stash.get(['next',0,'year',0]);output+='-';output+=stash.get(['next',0,'month',0]);output+='">\n    « ';output+=stash.get(['months',0,stash.get('index'),0]);output+=' ';output+=stash.get(['next',0,'year',0]);output+='\n</a>\n';}
output+='\n |\n<a href="#post-list"> Main </a>\n |\n';if(stash.get('prev')){stash.set('index',stash.get(['prev',0,'month',0]));output+='\n<a href="#archive-';output+=stash.get(['prev',0,'year',0]);output+='-';output+=stash.get(['prev',0,'month',0]);output+='">\n    ';output+=stash.get(['months',0,stash.get('index'),0]);output+=' ';output+=stash.get(['prev',0,'year',0]);output+=' »\n</a>\n';}
output+='\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['calendar.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{stash.set('index',stash.get('month')+1);output+='\n<h2 class="module-header">';output+=stash.get(['months',0,stash.get('index'),0]);output+=' ';output+=stash.get('year');output+='</h2>\n<div class="module-content">\n    <table id="calendar-nav">\n        <tbody>\n          <tr>\n            <th>\n                <a class="nav-arrow"\n                   href="javascript:void(0)"\n                   onclick="getCalendar(';output+=stash.get('year')-1;output+=', ';output+=stash.get('month');output+=')">\n                   &lt;&lt;\n                </a>\n            </th>\n            <th>\n                <a class="nav-arrow"\n                   href="javascript:void(0)"\n                   onclick="getCalendar(';output+=stash.get('month')-1<0?stash.get('year')-1:stash.get('year');output+=', ';output+=stash.get('month')-1<0?11:stash.get('month')-1;output+=')">\n                   &lt;\n                </a>\n            </th>\n            <th>&nbsp;</th>\n            <th>&nbsp;</th>\n            <th>&nbsp;</th>\n            <th>\n                <a class="nav-arrow"\n                   href="javascript:void(0)"\n                   onclick="getCalendar(';output+=stash.get('month')+1>11?stash.get('year')+1:stash.get('year');output+=', ';output+=stash.get('month')+1>11?0:stash.get('month')+1;output+=')">\n                   &gt;\n                </a>\n            </th>\n            <th>\n                <a class="nav-arrow"\n                   href="javascript:void(0)"\n                   onclick="getCalendar(';output+=stash.get('year')+1;output+=', ';output+=stash.get('month');output+=')">\n                   &gt;&gt;\n                </a>\n            </th>\n          </tr>\n        </tbody>\n    </table>\n    <table summary="Monthly calendar with links to each day\'s posts">\n        <tbody>\n          <tr>\n            <th>Sun</th>\n            <th>Mon</th>\n            <th>Tue</th>\n            <th>Wed</th>\n            <th>Thu</th>\n            <th>Fri</th>\n            <th>Sat</th>\n          </tr>';stash.set('day',1);var failsafe=1000;while(--failsafe&&(stash.get('day')<=stash.get('end_of_month'))){output+='\n          <tr>';stash.set('day_of_week',0);var failsafe=1000;while(--failsafe&&(stash.get('day_of_week')<=6)){stash.set('today_mark',stash.get('day')==stash.get('today')?'class="today-cell"':'');if((stash.get('day')>stash.get('end_of_month'))||(stash.get('day')==1&&stash.get('day_of_week')<stash.get('first_day_of_week'))){output+='                    <td>&nbsp;</td>';}
else{output+='                    <td id="day-';output+=stash.get('year');output+='-';output+=stash.get('month');output+='-';output+=stash.get('day');output+='" ';output+=stash.get('today_mark');output+='>';output+=stash.get('day');output+='</td>';stash.set('day',stash.get('day')+1);}
stash.set('day_of_week',stash.get('day_of_week')+1);}
if(!failsafe)
throw("WHILE loop terminated (> 1000 iterations)\n")}
if(!failsafe)
throw("WHILE loop terminated (> 1000 iterations)\n")
output+='\n          </tr>\n        </tbody>\n    </table>\n</div>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['comments.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{(function(){var list=stash.get('comments');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['comment']=value;output+='    <a id="post-';output+=stash.get(['comment',0,'post',0]);output+=':comment-';output+=stash.get(['comment',0,'id',0]);output+='"></a>\n    <div class="comment" id="comment-95523406">\n        <div class="comment-content">';if(stash.get(['comment',0,'body',0])){output+=stash.get(['comment',0,'body',0,'replace',['&','&amp;'],'replace',['<','&lt;'],'replace',['>','&gt;'],'replace',['\n','<br/>'],'replace',['  ','&nbsp; '],'replace',['(http://(?:\%[A-Fa-f0-9]{2}|[-A-Za-z./0-9~_])+)','<a href="$1">$1</a>']]);}
output+='\n        </div>\n        <p class="comment-footer">\n            Posted by:\n            ';if(stash.get(['comment',0,'url',0])){stash.set('url',stash.get(['comment',0,'url',0]));output+='\n                ';if(!stash.get(['url',0,'match',['^\\w+://']])){stash.set('url','http://'+stash.get('url'));}
output+='                <a href="';output+=(function(){var output='';output+=stash.get('url');return context.filter(output,'html',[]);})();output+='">';output+=(function(){var output='';output+=stash.get(['comment',0,'sender',0]);return context.filter(output,'html',[]);})();output+='</a>\n            ';}
else{output+='\n                ';output+=(function(){var output='';output+=stash.get(['comment',0,'sender',0]);return context.filter(output,'html',[]);})();output+=' |\n            ';}
output+='\n            ';output+=(function(){var output='';output+=stash.get(['comment',0,'created',0]);return context.filter(output,'html',[]);})();output+='\n        </p>\n    </div>';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['nav.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{stash.set('prev_post',stash.get('undef'));stash.set('next_post',stash.get('undef'));(function(){var list=stash.get('posts');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['post']=value;if(stash.get(['post',0,'id',0])<stash.get('current')){stash.set('prev_post',stash.get('post'));}
else{stash.set('next_post',stash.get('post'));};retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();if(stash.get('next_post')){output+='\n<a href="#post-';output+=stash.get(['next_post',0,'id',0]);output+='">\n    « ';output+=stash.get(['next_post',0,'title',0]);output+='\n</a>\n';}
output+='\n |\n<a href="#post-list"> Main </a>\n |\n';if(stash.get('prev_post')){output+='\n<a href="#post-';output+=stash.get(['prev_post',0,'id',0]);output+='">\n    ';output+=stash.get(['prev_post',0,'title',0]);output+=' »\n</a>\n';}
output+='\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['pager.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{stash.set('page',1,1);stash.set('page_count',stash.get('undef'),1);stash.set('title','Pages',1);output+='\n';if(stash.get('page_count')<=10){stash.set('from',1);stash.set('to',stash.get('page_count'));}
else{stash.set('from',stash.get('page')-10>=1?stash.get('page')-10:1);stash.set('to',stash.get('page')+9>=stash.get('page_count')?stash.get('page_count'):stash.get('page')+9);}
output+='\n<center>\n  <table class="paging">\n    <tr>\n      <td>\n        ';output+=stash.get('title');output+=':&nbsp; &nbsp;\n      </td>\n      <td>';if(stash.get('page')>1){output+='\n        <span class="prev-page">\n            <a href="#post-list-';output+=stash.get('page')-1;output+='">Previous</a>\n        </span>';}
output+='\n      </td>\n';stash.set('i',stash.get('from'));var failsafe=1000;while(--failsafe&&(stash.get('i')<=stash.get('to'))){if(stash.get('i')==stash.get('page')){output+='\n        <td class="highlight">';output+=stash.get('i');output+='</td>';}
else{output+='\n        <td><a href="#post-list-';output+=stash.get('i');output+='">';output+=stash.get('i');output+='</a></td>';}
stash.set('i',stash.get('i')+1);}
if(!failsafe)
throw("WHILE loop terminated (> 1000 iterations)\n")
output+='\n\n      <td>';if(stash.get('page')<stash.get('page_count')){output+='\n        <span class="next-page">\n            <a href="#post-list-';output+=stash.get('page')+1;output+='">Next</a>\n        </span>';}
output+='\n      </td>\n    </tr>\n  </table>\n</center>\n<br/>\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['post-list.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<div id="post-list-nav" class="content-nav"></div>\n';(function(){var list=stash.get('post_list');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['post']=value;output+='\n    ';output+=context.process('post.tt');output+='\n';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['post-page.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<p class="content-nav">\n</p>\n<!-- entry -->\n\n';output+=context.process('post.tt');output+='\n<a id="post-';output+=stash.get(['post',0,'id',0]);output+=':comments" name="post-';output+=stash.get(['post',0,'id',0]);output+='-comments"></a>\n    <div class="comments">\n        <h3 class="comments-header">Comments</h3>\n        <div class="comments-content">\n        <!-- comment list -->\n        </div>\n    </div>\n    <!-- comment form -->\n    <form id="comment-form" onsubmit="return false;" method="post">\n        <div class="comments-open">\n            <input id="comment-for" type="hidden" value="';output+=stash.get(['post',0,'id',0]);output+='"></input>\n            <h2 class="comments-open-header">Post a comment</h2>\n            <div class="comments-open-content">\n                <div id="comments-open-data">\n                <p>\n                    <label for="comment-author">Name:</label>\n                    <input id="comment-author" name="author" size="30" class="required"/>\n                </p>\n                <p>\n\n                    <label for="comment-email">Email Address: <span class="comment-form-note">(Not displayed with comment.)</span></label>\n                    <input id="comment-email" name="email" size="30" class="required" />\n                </p>\n                <p>\n                    <label for="comment-url">URL:</label>\n                    <input id="comment-url" name="url" size="30" />\n                </p>\n\n                <p>\n                    <label for="comment-bake-cookie"><input type="checkbox"\n                        id="comment-bake-cookie" name="bakecookie" value="1" />\n                        Remember personal info?</label>\n                </p>\n                </div>\n\n                <p id="comments-open-text">\n                    <label for="comment-text">Comments:</label>\n                    <textarea id="comment-text" name="text" rows="10" cols="30" class="required"></textarea>\n                </p>\n            </div>\n\n            <div id="comments-open-footer" class="comments-open-footer">\n                <!-- <button name="preview" id="comment-preview">&nbsp;Preview&nbsp;</button> -->\n                <button name="post" id="comment-post" onclick="postComment(';output+=stash.get(['post',0,'id',0]);output+=');">&nbsp;Post&nbsp;</button>\n            </div>\n\n        </div>\n    </form>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['post.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<h2 class="date-header">';output+=stash.get(['post',0,'created',0]);output+='</h2>\n<div class="entry">\n    <h3 class="entry-header">\n        <a href="#post-';output+=stash.get(['post',0,'id',0]);output+='">';output+=stash.get(['post',0,'title',0]);output+='        </a>\n    </h3>\n    <div class="entry-content">\n        <div class="entry-body">';output+=stash.get(['post',0,'content',0]);output+='            <p/>\n        </div>\n    </div>\n    <div class="entry-footer">\n        <p class="entry-footer-info">\n            <span class="post-footers">\n                Posted by ';output+=stash.get(['post',0,'author',0]);output+=' at\n                ';output+=stash.get(['post',0,'created',0]);output+=' in\n                <a href="#post-';output+=stash.get(['post',0,'id',0]);output+='">Articles</a>\n            </span>\n            <span class="separator">|</span>\n            <a class="permalink" href="#post-';output+=stash.get(['post',0,'id',0]);output+='">Permalink</a>\n            <span class="separator">|</span>\n            <a href="#post-';output+=stash.get(['post',0,'id',0]);output+=':comments">Comments\n                (<span class="comment-count" post="';output+=stash.get(['post',0,'id',0]);output+='">';output+=stash.get(['post',0,'comments',0]);output+='</span>)\n            </a>\n        </p>\n        <!-- technorati tags -->\n        <!-- post footer links -->\n    </div>\n</div>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['recent-comments.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<ul class="module-list">\n';output+=stash.get('last_id');output+='\n';(function(){var list=stash.get('comments');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['comment']=value;output+='    <li class="module-list-item">\n        <a href="#post-';output+=stash.get(['comment',0,'post',0]);output+=':comment-';output+=stash.get(['comment',0,'id',0]);output+='">\n        ';output+=(function(){var output='';output+=stash.get(['comment',0,'sender',0]);return context.filter(output,'html',[]);})();output+='</a> on\n        <a href="#post-';output+=stash.get(['comment',0,'post',0]);output+='">';output+=(function(){var output='';output+=stash.get(['comment',0,'title',0]);return context.filter(output,'html',[]);})();output+='</a>\n    </li>';stash.set('last_id',stash.get(['comment',0,'id',0]));output+='\n';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='</ul>\n\n<p class="module-more">\n\n';if(stash.get('offset')>0){output+='\n    <a href="javascript:getRecentComments(';output+=stash.get('offset')-stash.get('count');output+=')">&lt;&lt</a>\n';}
output+='\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n';if(stash.get('last_id')>1&&stash.get(['comments',0,'size',0])==stash.get('count')){output+='\n    <a id="more-recent-comments" href="javascript:getRecentComments(';output+=stash.get('offset')+stash.get('count');output+=');">\n    Next...\n    </a>\n';}
output+='\n\n</p>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['recent-posts.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<ul class="module-list">\n';output+=stash.get('last_id');output+='\n';(function(){var list=stash.get('posts');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['post']=value;output+='    <li class="module-list-item">\n        <a href="#post-';output+=stash.get(['post',0,'id',0]);output+='">';output+=stash.get(['post',0,'title',0]);output+='</a>\n    </li>';stash.set('last_id',stash.get(['post',0,'id',0]));output+='\n';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='</ul>\n\n<p class="module-more">\n\n';if(stash.get('offset')>0){output+='\n    <a href="javascript:getRecentPosts(';output+=stash.get('offset')-stash.get('count');output+=')">&lt;&lt;</a>\n';}
output+='\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n';if(stash.get('last_id')>1&&stash.get(['posts',0,'size',0])==stash.get('count')){output+='\n    <a id="more-recent-posts" href="javascript:getRecentPosts(';output+=stash.get('offset')+stash.get('count');output+=');">\n    Next...\n    </a>\n';}
output+='\n\n</p>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
if(typeof window.OpenResty=="undefined"){window.undefined=window.undefined;var OpenResty={callbackMap:{},isDone:{}};OpenResty.Client=function(params){if(params==undefined)params={};this.callback=params.callback;var server=params.server;if(!/^https?:\/\//.test(server)){server='http://'+server;}
this.server=server;this.user=params.user;};OpenResty.Client.prototype.isSuccess=function(res){return!(typeof res=='object'&&res.success==0&&res.error);};OpenResty.Client.prototype.logout=function(){this.get('/=/logout');};OpenResty.Client.prototype.login=function(user,password){this.user=user;var userCallback=this.callback;if(typeof userCallback=='string'){userCallback=eval(userCallback);}
var self=this;this.callback=function(data){self.session=data.session;userCallback(data);};if(password==null)
password='';else
password=hex_md5(password);this.get('/=/login/'+user+'/'+password);};OpenResty.Client.prototype.postByGet=function(url){var args,content;if(arguments.length==3){args=arguments[1];content=arguments[2];}else{content=arguments[1];}
if(!args)args={};url=url.replace(/^\/=\//,'/=/post/');content=JSON.stringify(content);args._data=content;this.get(url,args);};OpenResty.Client.prototype.post=function(url){var args,content;if(arguments.length==3){args=arguments[1];content=arguments[2];}else{content=arguments[1];}
if(!args)args={};if(url.match(/\?/))throw"URL should not contain '?'.";if(!this.callback)throw"No callback specified for OpenResty.";var formId=this.formId;if(!formId)throw"No form specified.";if(this.session)args._session=this.session;if(!this.session&&!args._user)
args._user=this.user;args._last_response=Math.round(Math.random()*1000000);content=JSON.stringify(content);var arg_list=new Array();for(var key in args){arg_list.push(key+"="+encodeURIComponent(args[key]));}
url+="?"+arg_list.join("&");var self=this;var form=document.getElementById(formId);form.method='POST';var ts=dojo.io.iframe.send({form:form,url:this.server+url,content:{data:content},preventCache:true,method:"post",handleAs:'html',handle:function(){self.get('/=/last/response/'+args._last_response);}});};OpenResty.Client.prototype.putByGet=function(url){var args,content;if(arguments.length==3){args=arguments[1];content=arguments[2];}else{content=arguments[1];}
if(!args)args={};url=url.replace(/^\/=\//,'/=/put/');content=JSON.stringify(content);args._data=content;this.get(url,args);};OpenResty.Client.prototype.put=function(url){var args,content;if(arguments.length==3){args=arguments[1];content=arguments[2];}else{content=arguments[1];}
if(!args)args={};url=url.replace(/^\/=\//,'/=/put/');this.post(content,url,args);};OpenResty.Client.prototype.get=function(url,args){if(!args)args={};if(!this.callback)throw"No callback specified for OpenResty.";if(!this.server)throw"No server specified for OpenResty.";if(this.session)args._session=this.session;if(!this.session&&!args._user)
args._user=this.user;if(url.match(/\?/))throw"URL should not contain '?'.";var reqId=Math.round(Math.random()*100000);var onerror=this.onerror;if(onerror==null)
onerror=function(){alert("Failed to do GET "+url)};var callback=this.callback;if(typeof callback=='string'){callback=eval(callback);}
OpenResty.isDone[reqId]=false;this.callback=function(res){OpenResty.isDone[reqId]=true;OpenResty.callbackMap[reqId]=null;callback(res);};OpenResty.callbackMap[reqId]=this.callback;args._callback="OpenResty.callbackMap["+reqId+"]";var headTag=document.getElementsByTagName('head')[0];var scriptTag=document.createElement("script");scriptTag.id="openapiScriptTag"+reqId;scriptTag.className='_openrestyScriptTag';var arg_list=new Array();for(var key in args){arg_list.push(key+"="+encodeURIComponent(args[key]));}
scriptTag.src=this.server+url+"?"+arg_list.join("&");scriptTag.type="text/javascript";scriptTag.onload=scriptTag.onreadystatechange=function(){var done=OpenResty.isDone[reqId];if(done){setTimeout(function(){try{headTag.removeChild(scriptTag);}catch(e){}},0);return;}
if(!this.readyState||this.readyState=="loaded"||this.readyState=="complete"){setTimeout(function(){if(!OpenResty.isDone[reqId]){onerror();OpenResty.isDone[reqId]=true;setTimeout(function(){try{headTag.removeChild(scriptTag);}catch(e){}},0);}},50);}};headTag.appendChild(scriptTag);};OpenResty.Client.prototype.del=function(url,args){if(!args)args={};url=url.replace(/^\/=\//,'/=/delete/');this.get(url,args);};OpenResty.Client.prototype.purge=function(){OpenResty.callbackMap={};OpenResty.isDone={};var nodes=document.getElementsByTagName('script');for(var i=0;i<nodes.length;i++){var node=nodes[i];if(node.className=='_openrestyScriptTag'){node.parentNode.removeChild(node);}}};}
var account='agentzh';var host='http://api.eeeeworks.org';var openresty=null;var savedAnchor=null;var itemsPerPage=5;var loadingCount=0;var waitMessage=null;var timer=null;var thisYear=null;var thisMonth=null;var thisDay=null;var months=[null,'January','February','March','April','May','June','July','August','September','October','November','December'];$(window).ready(init);function error(msg){alert(msg);}
function debug(msg){$("#copyright").append(msg+"<br/>");}
$.fn.postprocess=function(className,options){return this.find("a[@href^='#']").each(function(){var href=$(this).attr('href');var anchor=href.replace(/^.*?\#/,'');$(this).click(function(){location.hash=anchor;if(savedAnchor==anchor)savedAnchor=null;dispatchByAnchor();});});};function setStatus(isLoading,category){if(isLoading){if(++loadingCount==1){if(jQuery.browser.opera)
$(waitMessage).css('top','2px');else
$(waitMessage).show();}}else{loadingCount--;if(loadingCount<0)loadingCount=0;if(loadingCount==0){if(jQuery.browser.opera)
$(waitMessage).css('top','-200px');else
$(waitMessage).hide();}}}
function init(){loadingCount=0;var now=new Date();thisYear=now.getFullYear();thisMonth=now.getMonth();thisDay=now.getDate();waitMessage=document.getElementById('wait-message');openresty=new OpenResty.Client({server:host,user:account+'.Public'});if(timer){clearInterval(timer);}
dispatchByAnchor();timer=setInterval(dispatchByAnchor,600);getSidebar();}
function resetAnchor(){var anchor=location.hash;location.hash=anchor.replace(/^\#/,'');}
function dispatchByAnchor(){var anchor=location.hash;anchor=anchor.replace(/^\#/,'');if(savedAnchor==anchor)
return;if(anchor==""){anchor='main';location.hash='main';}
savedAnchor=anchor;loadingCount=0;var match=anchor.match(/^post-(\d+)(:comments|comment-(\d+))?/);if(match){var postId=match[1];getPost(postId);return;}
match=anchor.match(/^archive-(\d+)-(\d+)$/);if(match){var year=match[1];var month=match[2];getArchive(year,month);return;}
match=anchor.match(/^(?:post-list|post-list-(\d+))$/);var page=1;if(match)
page=parseInt(match[1])||1;else if(anchor!='main')
top.location.hash='main';getPostList(page);getPager(page);$(".blog-top").attr('id','post-list-'+page);}
function getArchive(year,month){setStatus(true,'renderPostList');$(".pager").html('');openresty.callback=function(res){renderPostList(res);setStatus(true,'renderArchiveNav');openresty.callback=renderArchiveNav;openresty.get('/=/view/PrevNextArchive/~/~',{now:year+'-'+month+'-01',month:month,months:months});};openresty.get('/=/view/FullPostsByMonth/~/~',{count:40,year:year,month:month});$(".blog-top").attr('id','archive-'+year+'-'+month);}
function renderArchiveNav(res){setStatus(false,'renderArchiveNav');if(!openresty.isSuccess(res)){error("Failed to get archive navigator: "+res.error);return;}
var prev=null;var next=null;for(var i=0;i<res.length;i++){var item=res[i];item.year=parseInt(item.year);item.month=parseInt(item.month);if(item.id=="prev")prev=item;else if(item.id=="next")next=item;}
$("#post-list-nav").html(Jemplate.process('archive-nav.tt',{next:next,prev:prev,months:months})).postprocess();}
function getPostList(page){setStatus(true,'renderPostList');openresty.callback=renderPostList;openresty.get('/=/model/Post/~/~',{_count:itemsPerPage,_order_by:'id:desc',_offset:itemsPerPage*(page-1)});}
function getPager(page){setStatus(true,'renderPager');openresty.callback=function(res){renderPager(res,page);};openresty.get('/=/view/RowCount/model/Post');}
function getSidebar(){getCalendar();getRecentPosts();getRecentComments();getArchiveList();}
function getCalendar(year,month){if(year==undefined||month==undefined){year=thisYear;month=thisMonth;}
var date=new Date(year,month,1);var first_day_of_week=date.getDay();var end_of_month;if(month==11){end_of_month=31;}else{var delta=new Date(year,month+1,1)-date;end_of_month=Math.round(delta/1000/60/60/24);}
$(".module-calendar").html(Jemplate.process('calendar.tt',{year:year,month:month,first_day_of_week:first_day_of_week,end_of_month:end_of_month,today:(year==thisYear&&month==thisMonth)?thisDay:null,months:months})).postprocess();setTimeout(function(){setStatus(true,'renderPostsInCalendar');openresty.callback=function(res){renderPostsInCalendar(res,year,month);};openresty.get('/=/view/PostsByMonth/~/~',{year:year,month:month+1});},0);}
function renderPostsInCalendar(res,year,month){setStatus(false,'renderPostsInCalendar');if(!openresty.isSuccess(res)){error("Failed to fetch posts for calendar: "+
res.error);}else{var prev_day=0;for(var i=0;i<res.length;i++){var line=res[i];if(prev_day==line.day)continue;prev_day=line.day;var id='day-'+year+'-'+month+'-'+line.day;var cell=$("#"+id);if(cell.length==0)return;cell.html('<a href="#post-'+line.id+'"><b>'+
cell.html()+'</b></a>').postprocess();}}}
function getRecentComments(offset){if(!offset)offset=0;setStatus(true,'renderRecentComments');openresty.callback=function(res){renderRecentComments(res,offset,6)};openresty.get('/=/view/RecentComments/limit/6',{offset:offset});}
function renderRecentComments(res,offset,count){setStatus(false,'renderRecentComments');if(!openresty.isSuccess(res)){error("Failed to get the recent comments: "+res.error);}else{var html=Jemplate.process('recent-comments.tt',{comments:res,offset:offset,count:count});$("#recent-comments").html(html).postprocess();}}
function getRecentPosts(offset){if(!offset)offset=0;setStatus(true,'renderRecentPosts');openresty.callback=function(res){renderRecentPosts(res,offset,6)};openresty.get('/=/view/RecentPosts/limit/6',{offset:offset});}
function renderRecentPosts(res,offset,count){setStatus(false,'renderRecentPosts');if(!openresty.isSuccess(res)){error("Failed to get the recent posts: "+res.error);}else{var html=Jemplate.process('recent-posts.tt',{posts:res,offset:offset,count:count});$("#recent-posts").html(html).postprocess();}}
function getArchiveList(offset){if(offset==undefined)offset=0;setStatus(true,'getArchiveList');openresty.callback=function(res){renderArchiveList(res,offset,12);};openresty.get('/=/view/PostCountByMonths/~/~',{offset:offset,count:12});}
function renderArchiveList(res,offset,count){setStatus(false,'getArchiveList');if(!openresty.isSuccess(res)){error("Failed to get archive list: "+res.error);return;}
for(var i=0;i<res.length;i++){var item=res[i];var match=item.year_month.match(/^(\d\d\d\d)-0?(\d+)/);if(match){item.year=parseInt(match[1]);item.month=parseInt(match[2]);}else{error("Failed to match against year_month: "+item.year_month);}}
$("#archive-list").html(Jemplate.process('archive-list.tt',{archives:res,count:count,offset:offset,months:months})).postprocess();}
function postComment(form){var data={};data.sender=$("#comment-author").val();data.email=$("#comment-email").val();data.url=$("#comment-url").val();data.body=$("#comment-text").val();data.post=$("#comment-for").val();if(!data.sender){error("Name is required.");return false;}
if(!data.email){error("Email address is required.");return false;}
if(!data.body){error("Comment body is required.");return false;}
setStatus(true,'afterPostComment');openresty.callback=afterPostComment;openresty.postByGet('/=/model/Comment/~/~',data);return false;}
function afterPostComment(res){setStatus(false,'afterPostComment');if(!openresty.isSuccess(res)){error("Failed to post the comment: "+res.error);}else{$("#comment-text").val('');var spans=$(".comment-count");var commentCount=parseInt(spans.text());var postId=spans.attr('post');var commentId;var match=res.last_row.match(/\d+$/);if(match.length)commentId=match[0];location.hash='post-'+postId+':'+
(commentId?'comment-'+commentId:'comments');openresty.callback=function(res){if(!openresty.isSuccess(res)){error("Failed to increment the comment count for post "+
postId+": "+res.error);}else{spans.text(commentCount+1);}};openresty.putByGet('/=/model/Post/id/'+postId,{comments:commentCount+1});getRecentComments(0);}}
function getPost(id){$(".blog-top").attr('id','post-'+id);setStatus(true,'renderPost');openresty.callback=renderPost;openresty.get('/=/model/Post/id/'+id);}
function renderPost(res){setStatus(false,'renderPost');if(!openresty.isSuccess(res)){error("Failed to render post: "+res.error);}else{var post=res[0];$("#beta-inner.pkg").html(Jemplate.process('post-page.tt',{post:post})).postprocess();openresty.callback=function(res){renderPrevNextPost(post.id,res);};openresty.get('/=/view/PrevNextPost/current/'+post.id);setStatus(true,'renderComments');openresty.callback=renderComments;openresty.get('/=/model/Comment/post/'+post.id);$(".pager").html('');}}
function renderPrevNextPost(currentId,res){if(!openresty.isSuccess(res)){error("Failed to render prev next post navigation: "+
res.error);}else{$(".content-nav").html(Jemplate.process('nav.tt',{posts:res,current:currentId})).postprocess();resetAnchor();}}
function renderComments(res){setStatus(false,'renderComments');if(!openresty.isSuccess(res)){error("Failed to render post list: "+res.error);}else{$(".comments-content").html(Jemplate.process('comments.tt',{comments:res}));resetAnchor();}}
function renderPostList(res){setStatus(false,'renderPostList');if(!openresty.isSuccess(res)){error("Failed to render post list: "+res.error);}else{$("#beta-inner.pkg").html(Jemplate.process('post-list.tt',{post_list:res})).postprocess();}
resetAnchor();}
function renderPager(res,page){setStatus(false,'renderPager');if(!openresty.isSuccess(res)){error("Failed to render pager: "+res.error);}else{var pageCount=Math.ceil(parseInt(res[0].count)/itemsPerPage);if(pageCount<2)return;var html=Jemplate.process('pager.tt',{page:page,page_count:pageCount,title:'Pages'});$(".pager").each(function(){$(this).html(html).postprocess();});resetAnchor();}}
if(typeof Jemplate=='undefined'){Jemplate=function(){this.init.apply(this,arguments);};}
if(!Jemplate.templateMap)
Jemplate.templateMap={};Jemplate.process=function(){var jemplate=new Jemplate();return jemplate.process.apply(jemplate,arguments);}
proto=Jemplate.prototype;proto.init=function(config){this.config=config||{AUTO_RESET:true,BLOCKS:{},CONTEXT:null,DEBUG_UNDEF:false,DEFAULT:null,ERROR:null,EVAL_JAVASCRIPT:false,FILTERS:{},INCLUDE_PATH:[''],INTERPOLATE:false,OUTPUT:null,PLUGINS:{},POST_PROCESS:[],PRE_PROCESS:[],PROCESS:null,RECURSION:false,STASH:null,TOLERANT:null,VARIABLES:{},WRAPPER:[]};}
proto.process=function(template,data,output){var context=this.config.CONTEXT||new Jemplate.Context();context.config=this.config;context.stash=this.config.STASH||new Jemplate.Stash();context.stash.__config__=this.config;context.__filter__=new Jemplate.Filter();context.__filter__.config=this.config;var result;var proc=function(input){try{result=context.process(template,input);}
catch(e){if(!String(e).match(/Jemplate\.STOP\n/))
throw(e);result=e.toString().replace(/Jemplate\.STOP\n/,'');}
if(typeof output=='undefined')
return result;if(typeof output=='function'){output(result);return;}
if(typeof(output)=='string'||output instanceof String){if(output.match(/^#[\w\-]+$/)){var id=output.replace(/^#/,'');var element=document.getElementById(id);if(typeof element=='undefined')
throw('No element found with id="'+id+'"');element.innerHTML=result;return;}}
else{output.innerHTML=result;return;}
throw("Invalid arguments in call to Jemplate.process");return 1;}
if(typeof data=='function')
data=data();else if(typeof data=='string'){Ajax.get(data,function(r){proc(JSON.parse(r))});return;}
return proc(data);}
if(typeof Jemplate.Context=='undefined')
Jemplate.Context=function(){};proto=Jemplate.Context.prototype;proto.include=function(template,args){return this.process(template,args,true);}
proto.process=function(template,args,localise){if(localise)
this.stash.clone(args);else
this.stash.update(args);var func=Jemplate.templateMap[template];if(typeof func=='undefined')
throw('No Jemplate template named "'+template+'" available');var output=func(this);if(localise)
this.stash.declone();return output;}
proto.set_error=function(error,output){this._error=[error,output];return error;}
proto.filter=function(text,name,args){if(name=='null')
name="null_filter";if(typeof this.__filter__.filters[name]=="function")
return this.__filter__.filters[name](text,args,this);else
throw"Unknown filter name ':"+name+"'";}
if(typeof Jemplate.Filter=='undefined'){Jemplate.Filter=function(){};}
proto=Jemplate.Filter.prototype;proto.filters={};proto.filters.null_filter=function(text){return'';}
proto.filters.upper=function(text){return text.toUpperCase();}
proto.filters.lower=function(text){return text.toLowerCase();}
proto.filters.ucfirst=function(text){var first=text.charAt(0);var rest=text.substr(1);return first.toUpperCase()+rest;}
proto.filters.lcfirst=function(text){var first=text.charAt(0);var rest=text.substr(1);return first.toLowerCase()+rest;}
proto.filters.trim=function(text){return text.replace(/^\s+/g,"").replace(/\s+$/g,"");}
proto.filters.collapse=function(text){return text.replace(/^\s+/g,"").replace(/\s+$/g,"").replace(/\s+/," ");}
proto.filters.html=function(text){text=text.replace(/&/g,'&amp;');text=text.replace(/</g,'&lt;');text=text.replace(/>/g,'&gt;');text=text.replace(/"/g,'&quot;');return text;}
proto.filters.html_para=function(text){var lines=text.split(/(?:\r?\n){2,}/);return"<p>\n"+lines.join("\n</p>\n\n<p>\n")+"</p>\n";}
proto.filters.html_break=function(text){return text.replace(/(\r?\n){2,}/g,"$1<br />$1<br />$1");}
proto.filters.html_line_break=function(text){return text.replace(/(\r?\n)/g,"$1<br />$1");}
proto.filters.uri=function(text){return encodeURI(text);}
proto.filters.indent=function(text,args){var pad=args[0];if(!text)return;if(typeof pad=='undefined')
pad=4;var finalpad='';if(typeof pad=='number'||String(pad).match(/^\d$/)){for(var i=0;i<pad;i++){finalpad+=' ';}}else{finalpad=pad;}
var output=text.replace(/^/gm,finalpad);return output;}
proto.filters.truncate=function(text,args){var len=args[0];if(!text)return;if(!len)
len=32;if(text.length<len)
return text;var newlen=len-3;return text.substr(0,newlen)+'...';}
proto.filters.repeat=function(text,iter){if(!text)return;if(!iter||iter==0)
iter=1;if(iter==1)return text
var output=text;for(var i=1;i<iter;i++){output+=text;}
return output;}
proto.filters.replace=function(text,args){if(!text)return;var re_search=args[0];var text_replace=args[1];if(!re_search)
re_search='';if(!text_replace)
text_replace='';var re=new RegExp(re_search,'g');return text.replace(re,text_replace);}
if(typeof Jemplate.Stash=='undefined'){Jemplate.Stash=function(){this.data={};};}
proto=Jemplate.Stash.prototype;proto.clone=function(args){var data=this.data;this.data={};this.update(data);this.update(args);this.data._PARENT=data;}
proto.declone=function(args){this.data=this.data._PARENT||this.data;}
proto.update=function(args){if(typeof args=='undefined')return;for(var key in args){var value=args[key];this.set(key,value);}}
proto.get=function(key){var root=this.data;if(key instanceof Array){for(var i=0;i<key.length;i+=2){var args=key.slice(i,i+2);args.unshift(root);value=this._dotop.apply(this,args);if(typeof value=='undefined')
break;root=value;}}
else{value=this._dotop(root,key);}
if(typeof value=='undefined'){if(this.__config__.DEBUG_UNDEF)
throw("undefined value found while using DEGUG_UNDEF");value='';}
return value;}
proto.set=function(key,value,set_default){if(key instanceof Array){var data=this.get(key[0])||{};key=key[2];}
else{data=this.data;}
if(!(set_default&&(typeof data[key]!='undefined')))
data[key]=value;}
proto._dotop=function(root,item,args){if(typeof item=='undefined'||typeof item=='string'&&item.match(/^[\._]/)){return undefined;}
if((!args)&&(typeof root=='object')&&(!(root instanceof Array)||(typeof item=='number'))&&(typeof root[item]!='undefined')){var value=root[item];if(typeof value=='function')
value=value();return value;}
if(typeof root=='string'&&this.string_functions[item])
return this.string_functions[item](root,args);if(root instanceof Array&&this.list_functions[item])
return this.list_functions[item](root,args);if(typeof root=='object'&&this.hash_functions[item])
return this.hash_functions[item](root,args);if(typeof root[item]=='function')
return root[item].apply(root,args);return undefined;}
proto.string_functions={};proto.string_functions.chunk=function(string,args){var size=args[0];var list=new Array();if(!size)
size=1;if(size<0){size=0-size;for(i=string.length-size;i>=0;i=i-size)
list.unshift(string.substr(i,size));if(string.length%size)
list.unshift(string.substr(0,string.length%size));}
else
for(i=0;i<string.length;i=i+size)
list.push(string.substr(i,size));return list;}
proto.string_functions.defined=function(string){return 1;}
proto.string_functions.hash=function(string){return{'value':string};}
proto.string_functions.length=function(string){return string.length;}
proto.string_functions.list=function(string){return[string];}
proto.string_functions.match=function(string,args){var regexp=new RegExp(args[0],'gm');var list=string.match(regexp);return list;}
proto.string_functions.repeat=function(string,args){var n=args[0]||1;var output='';for(var i=0;i<n;i++){output+=string;}
return output;}
proto.string_functions.replace=function(string,args){var regexp=new RegExp(args[0],'gm');var sub=args[1];if(!sub)
sub='';var output=string.replace(regexp,sub);return output;}
proto.string_functions.search=function(string,args){var regexp=new RegExp(args[0]);return(string.search(regexp)>=0)?1:0;}
proto.string_functions.size=function(string){return 1;}
proto.string_functions.split=function(string,args){var regexp=new RegExp(args[0]);var list=string.split(regexp);return list;}
proto.list_functions={};proto.list_functions.join=function(list,args){return list.join(args[0]);};proto.list_functions.sort=function(list,key){if(typeof(key)!='undefined'&&key!=""){return list.sort(function(a,b){if(a[key]==b[key]){return 0;}
else if(a[key]>b[key]){return 1;}
else{return-1;}});}
return list.sort();}
proto.list_functions.nsort=function(list){return list.sort(function(a,b){return(a-b)});}
proto.list_functions.grep=function(list,args){var regexp=new RegExp(args[0]);var result=[];for(var i=0;i<list.length;i++){if(list[i].match(regexp))
result.push(list[i]);}
return result;}
proto.list_functions.unique=function(list){var result=[];var seen={};for(var i=0;i<list.length;i++){var elem=list[i];if(!seen[elem])
result.push(elem);seen[elem]=true;}
return result;}
proto.list_functions.reverse=function(list){var result=[];for(var i=list.length-1;i>=0;i--){result.push(list[i]);}
return result;}
proto.list_functions.merge=function(list,args){var result=[];var push_all=function(elem){if(elem instanceof Array){for(var j=0;j<elem.length;j++){result.push(elem[j]);}}
else{result.push(elem);}}
push_all(list);for(var i=0;i<args.length;i++){push_all(args[i]);}
return result;}
proto.list_functions.slice=function(list,args){return list.slice(args[0],args[1]);}
proto.list_functions.splice=function(list,args){if(args.length==1)
return list.splice(args[0]);if(args.length==2)
return list.splice(args[0],args[1]);if(args.length==3)
return list.splice(args[0],args[1],args[2]);}
proto.list_functions.push=function(list,args){list.push(args[0]);return list;}
proto.list_functions.pop=function(list){return list.pop();}
proto.list_functions.unshift=function(list,args){list.unshift(args[0]);return list;}
proto.list_functions.shift=function(list){return list.shift();}
proto.list_functions.first=function(list){return list[0];}
proto.list_functions.size=function(list){return list.length;}
proto.list_functions.max=function(list){return list.length-1;}
proto.list_functions.last=function(list){return list.slice(-1);}
proto.hash_functions={};proto.hash_functions.each=function(hash){var list=new Array();for(var key in hash)
list.push(key,hash[key]);return list;}
proto.hash_functions.exists=function(hash,args){return(typeof(hash[args[0]])=="undefined")?0:1;}
proto.hash_functions.keys=function(hash){var list=new Array();for(var key in hash)
list.push(key);return list;}
proto.hash_functions.list=function(hash,args){var what='';if(args)
var what=args[0];var list=new Array();if(what=='keys')
for(var key in hash)
list.push(key);else if(what=='values')
for(var key in hash)
list.push(hash[key]);else if(what=='each')
for(var key in hash)
list.push(key,hash[key]);else
for(var key in hash)
list.push({'key':key,'value':hash[key]});return list;}
proto.hash_functions.nsort=function(hash){var list=new Array();for(var key in hash)
list.push(key);return list.sort(function(a,b){return(a-b)});}
proto.hash_functions.size=function(hash){var size=0;for(var key in hash)
size++;return size;}
proto.hash_functions.sort=function(hash){var list=new Array();for(var key in hash)
list.push(key);return list.sort();}
proto.hash_functions.values=function(hash){var list=new Array();for(var key in hash)
list.push(hash[key]);return list;}
if(typeof Jemplate.Iterator=='undefined'){Jemplate.Iterator=function(object){if(object instanceof Array){this.object=object;this.size=object.length;this.max=this.size-1;}
else if(object instanceof Object){this.object=object;var object_keys=new Array;for(var key in object){object_keys[object_keys.length]=key;}
this.object_keys=object_keys.sort();this.size=object_keys.length;this.max=this.size-1;}}}
proto=Jemplate.Iterator.prototype;proto.get_first=function(){this.index=0;this.first=1;this.last=0;this.count=1;return this.get_next(1);}
proto.get_next=function(should_init){var object=this.object;var index;if(typeof(should_init)!='undefined'&&should_init){index=this.index;}else{index=++this.index;this.first=0;this.count=this.index+1;if(this.index==this.size-1){this.last=1;}}
if(typeof object=='undefined')
throw('No object to iterate');if(this.object_keys){if(index<this.object_keys.length){this.prev=index>0?this.object_keys[index-1]:"";this.next=index<this.max?this.object_keys[index+1]:"";return[this.object_keys[index],false];}}else{if(index<object.length){this.prev=index>0?object[index-1]:"";this.next=index<this.max?object[index+1]:"";return[object[index],false];}}
return[null,true];}
function XXX(msg){if(!confirm(msg))
throw("terminated...");return msg;}
function JJJ(obj){return XXX(JSON.stringify(obj));}
if(!this.Ajax)Ajax={};Ajax.get=function(url,callback){var req=new XMLHttpRequest();req.open('GET',url,Boolean(callback));return Ajax._send(req,null,callback);}
Ajax.post=function(url,data,callback){var req=new XMLHttpRequest();req.open('POST',url,Boolean(callback));req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');return Ajax._send(req,data,callback);}
Ajax._send=function(req,data,callback){if(callback){req.onreadystatechange=function(){if(req.readyState==4){if(req.status==200)
callback(req.responseText);}};}
req.send(data);if(!callback){if(req.status!=200)
throw('Request for "'+url+'" failed with status: '+req.status);return req.responseText;}}
if(window.ActiveXObject&&!window.XMLHttpRequest){window.XMLHttpRequest=function(){return new ActiveXObject((navigator.userAgent.toLowerCase().indexOf('msie 5')!=-1)?'Microsoft.XMLHTTP':'Msxml2.XMLHTTP');};}
if(window.opera&&!window.XMLHttpRequest){window.XMLHttpRequest=function(){this.readyState=0;this.status=0;this.statusText='';this._headers=[];this._aborted=false;this._async=true;this.abort=function(){this._aborted=true;};this.getAllResponseHeaders=function(){return this.getAllResponseHeader('*');};this.getAllResponseHeader=function(header){var ret='';for(var i=0;i<this._headers.length;i++){if(header=='*'||this._headers[i].h==header){ret+=this._headers[i].h+': '+this._headers[i].v+'\n';}}
return ret;};this.setRequestHeader=function(header,value){this._headers[this._headers.length]={h:header,v:value};};this.open=function(method,url,async,user,password){this.method=method;this.url=url;this._async=true;this._aborted=false;if(arguments.length>=3){this._async=async;}
if(arguments.length>3){opera.postError('XMLHttpRequest.open() - user/password not supported');}
this._headers=[];this.readyState=1;if(this.onreadystatechange){this.onreadystatechange();}};this.send=function(data){if(!navigator.javaEnabled()){alert("XMLHttpRequest.send() - Java must be installed and enabled.");return;}
if(this._async){setTimeout(this._sendasync,0,this,data);}else{this._sendsync(data);}}
this._sendasync=function(req,data){if(!req._aborted){req._sendsync(data);}};this._sendsync=function(data){this.readyState=2;if(this.onreadystatechange){this.onreadystatechange();}
var url=new java.net.URL(new java.net.URL(window.location.href),this.url);var conn=url.openConnection();for(var i=0;i<this._headers.length;i++){conn.setRequestProperty(this._headers[i].h,this._headers[i].v);}
this._headers=[];if(this.method=='POST'){conn.setDoOutput(true);var wr=new java.io.OutputStreamWriter(conn.getOutputStream());wr.write(data);wr.flush();wr.close();}
var gotContentEncoding=false;var gotContentLength=false;var gotContentType=false;var gotDate=false;var gotExpiration=false;var gotLastModified=false;for(var i=0;;i++){var hdrName=conn.getHeaderFieldKey(i);var hdrValue=conn.getHeaderField(i);if(hdrName==null&&hdrValue==null){break;}
if(hdrName!=null){this._headers[this._headers.length]={h:hdrName,v:hdrValue};switch(hdrName.toLowerCase()){case'content-encoding':gotContentEncoding=true;break;case'content-length':gotContentLength=true;break;case'content-type':gotContentType=true;break;case'date':gotDate=true;break;case'expires':gotExpiration=true;break;case'last-modified':gotLastModified=true;break;}}}
var val;val=conn.getContentEncoding();if(val!=null&&!gotContentEncoding)this._headers[this._headers.length]={h:'Content-encoding',v:val};val=conn.getContentLength();if(val!=-1&&!gotContentLength)this._headers[this._headers.length]={h:'Content-length',v:val};val=conn.getContentType();if(val!=null&&!gotContentType)this._headers[this._headers.length]={h:'Content-type',v:val};val=conn.getDate();if(val!=0&&!gotDate)this._headers[this._headers.length]={h:'Date',v:(new Date(val)).toUTCString()};val=conn.getExpiration();if(val!=0&&!gotExpiration)this._headers[this._headers.length]={h:'Expires',v:(new Date(val)).toUTCString()};val=conn.getLastModified();if(val!=0&&!gotLastModified)this._headers[this._headers.length]={h:'Last-modified',v:(new Date(val)).toUTCString()};var reqdata='';var stream=conn.getInputStream();if(stream){var reader=new java.io.BufferedReader(new java.io.InputStreamReader(stream));var line;while((line=reader.readLine())!=null){if(this.readyState==2){this.readyState=3;if(this.onreadystatechange){this.onreadystatechange();}}
reqdata+=line+'\n';}
reader.close();this.status=200;this.statusText='OK';this.responseText=reqdata;this.readyState=4;if(this.onreadystatechange){this.onreadystatechange();}
if(this.onload){this.onload();}}else{this.status=404;this.statusText='Not Found';this.responseText='';this.readyState=4;if(this.onreadystatechange){this.onreadystatechange();}
if(this.onerror){this.onerror();}}};};}
if(!window.ActiveXObject&&window.XMLHttpRequest){window.ActiveXObject=function(type){switch(type.toLowerCase()){case'microsoft.xmlhttp':case'msxml2.xmlhttp':return new XMLHttpRequest();}
return null;};}
var JSON=function(){var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},s={'boolean':function(x){return String(x);},number:function(x){return isFinite(x)?String(x):'null';},string:function(x){if(/["\\\x00-\x1f]/.test(x)){x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){var c=m[b];if(c){return c;}
c=b.charCodeAt();return'\\u00'+
Math.floor(c/16).toString(16)+
(c%16).toString(16);});}
return'"'+x+'"';},object:function(x){if(x){var a=[],b,f,i,l,v;if(x instanceof Array){a[0]='[';l=x.length;for(i=0;i<l;i+=1){v=x[i];f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a[a.length]=v;b=true;}}}
a[a.length]=']';}else if(x instanceof Object){a[0]='{';for(i in x){v=x[i];f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a.push(s.string(i),':',v);b=true;}}}
a[a.length]='}';}else{return;}
return a.join('');}
return'null';}};return{copyright:'(c)2005 JSON.org',license:'http://www.crockford.com/JSON/license.html',stringify:function(v){var f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){return v;}}
return null;},parse:function(text){try{return!(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g,'')))&&eval('('+text+')');}catch(e){return false;}}};}();if(typeof(Jemplate)=='undefined')
throw('Jemplate.js must be loaded before any Jemplate template files');Jemplate.templateMap['archive-list.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<ul class="module-list">\n';(function(){var list=stash.get('archives');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['archive']=value;output+='    <li class="module-list-item">';stash.set('index',stash.get(['archive',0,'month',0]));output+='\n        <a href="#archive-';output+=stash.get(['archive',0,'year',0]);output+='-';output+=stash.get(['archive',0,'month',0]);output+='">';output+=stash.get(['months',0,stash.get('index'),0]);output+=' ';output+=stash.get(['archive',0,'year',0]);output+=' (';output+=stash.get(['archive',0,'count',0]);output+=')</a>\n    </li>\n';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='</ul>\n\n<p class="module-more">\n\n';if(stash.get('offset')>0){output+='\n    <a href="javascript:getArchiveList(';output+=stash.get('offset')-stash.get('count');output+=')">&lt;&lt;</a>\n';}
output+='\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n';if(stash.get(['archives',0,'size',0])==stash.get('count')){output+='\n    <a id="more-archives" href="javascript:getArchiveList(';output+=stash.get('offset')+stash.get('count');output+=');">\n    Next...\n    </a>\n';}
output+='\n\n</p>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['archive-nav.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{if(stash.get('next')){stash.set('index',stash.get(['next',0,'month',0]));output+='\n<a href="#archive-';output+=stash.get(['next',0,'year',0]);output+='-';output+=stash.get(['next',0,'month',0]);output+='">\n    « ';output+=stash.get(['months',0,stash.get('index'),0]);output+=' ';output+=stash.get(['next',0,'year',0]);output+='\n</a>\n';}
output+='\n |\n<a href="#post-list"> Main </a>\n |\n';if(stash.get('prev')){stash.set('index',stash.get(['prev',0,'month',0]));output+='\n<a href="#archive-';output+=stash.get(['prev',0,'year',0]);output+='-';output+=stash.get(['prev',0,'month',0]);output+='">\n    ';output+=stash.get(['months',0,stash.get('index'),0]);output+=' ';output+=stash.get(['prev',0,'year',0]);output+=' »\n</a>\n';}
output+='\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['calendar.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{stash.set('index',stash.get('month')+1);output+='\n<h2 class="module-header">';output+=stash.get(['months',0,stash.get('index'),0]);output+=' ';output+=stash.get('year');output+='</h2>\n<div class="module-content">\n    <table id="calendar-nav">\n        <tbody>\n          <tr>\n            <th>\n                <a class="nav-arrow"\n                   href="javascript:void(0)"\n                   onclick="getCalendar(';output+=stash.get('year')-1;output+=', ';output+=stash.get('month');output+=')">\n                   &lt;&lt;\n                </a>\n            </th>\n            <th>\n                <a class="nav-arrow"\n                   href="javascript:void(0)"\n                   onclick="getCalendar(';output+=stash.get('month')-1<0?stash.get('year')-1:stash.get('year');output+=', ';output+=stash.get('month')-1<0?11:stash.get('month')-1;output+=')">\n                   &lt;\n                </a>\n            </th>\n            <th>&nbsp;</th>\n            <th>&nbsp;</th>\n            <th>&nbsp;</th>\n            <th>\n                <a class="nav-arrow"\n                   href="javascript:void(0)"\n                   onclick="getCalendar(';output+=stash.get('month')+1>11?stash.get('year')+1:stash.get('year');output+=', ';output+=stash.get('month')+1>11?0:stash.get('month')+1;output+=')">\n                   &gt;\n                </a>\n            </th>\n            <th>\n                <a class="nav-arrow"\n                   href="javascript:void(0)"\n                   onclick="getCalendar(';output+=stash.get('year')+1;output+=', ';output+=stash.get('month');output+=')">\n                   &gt;&gt;\n                </a>\n            </th>\n          </tr>\n        </tbody>\n    </table>\n    <table summary="Monthly calendar with links to each day\'s posts">\n        <tbody>\n          <tr>\n            <th>Sun</th>\n            <th>Mon</th>\n            <th>Tue</th>\n            <th>Wed</th>\n            <th>Thu</th>\n            <th>Fri</th>\n            <th>Sat</th>\n          </tr>';stash.set('day',1);var failsafe=1000;while(--failsafe&&(stash.get('day')<=stash.get('end_of_month'))){output+='\n          <tr>';stash.set('day_of_week',0);var failsafe=1000;while(--failsafe&&(stash.get('day_of_week')<=6)){stash.set('today_mark',stash.get('day')==stash.get('today')?'class="today-cell"':'');if((stash.get('day')>stash.get('end_of_month'))||(stash.get('day')==1&&stash.get('day_of_week')<stash.get('first_day_of_week'))){output+='                    <td>&nbsp;</td>';}
else{output+='                    <td id="day-';output+=stash.get('year');output+='-';output+=stash.get('month');output+='-';output+=stash.get('day');output+='" ';output+=stash.get('today_mark');output+='>';output+=stash.get('day');output+='</td>';stash.set('day',stash.get('day')+1);}
stash.set('day_of_week',stash.get('day_of_week')+1);}
if(!failsafe)
throw("WHILE loop terminated (> 1000 iterations)\n")}
if(!failsafe)
throw("WHILE loop terminated (> 1000 iterations)\n")
output+='\n          </tr>\n        </tbody>\n    </table>\n</div>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['comments.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{(function(){var list=stash.get('comments');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['comment']=value;output+='    <a id="post-';output+=stash.get(['comment',0,'post',0]);output+=':comment-';output+=stash.get(['comment',0,'id',0]);output+='"></a>\n    <div class="comment" id="comment-95523406">\n        <div class="comment-content">';if(stash.get(['comment',0,'body',0])){output+=stash.get(['comment',0,'body',0,'replace',['&','&amp;'],'replace',['<','&lt;'],'replace',['>','&gt;'],'replace',['\n','<br/>'],'replace',['  ','&nbsp; '],'replace',['(http://(?:\%[A-Fa-f0-9]{2}|[-A-Za-z./0-9~_])+)','<a href="$1">$1</a>']]);}
output+='\n        </div>\n        <p class="comment-footer">\n            Posted by:\n            ';if(stash.get(['comment',0,'url',0])){stash.set('url',stash.get(['comment',0,'url',0]));output+='\n                ';if(!stash.get(['url',0,'match',['^\\w+://']])){stash.set('url','http://'+stash.get('url'));}
output+='                <a href="';output+=(function(){var output='';output+=stash.get('url');return context.filter(output,'html',[]);})();output+='">';output+=(function(){var output='';output+=stash.get(['comment',0,'sender',0]);return context.filter(output,'html',[]);})();output+='</a>\n            ';}
else{output+='\n                ';output+=(function(){var output='';output+=stash.get(['comment',0,'sender',0]);return context.filter(output,'html',[]);})();output+=' |\n            ';}
output+='\n            ';output+=(function(){var output='';output+=stash.get(['comment',0,'created',0]);return context.filter(output,'html',[]);})();output+='\n        </p>\n    </div>';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['nav.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{stash.set('prev_post',stash.get('undef'));stash.set('next_post',stash.get('undef'));(function(){var list=stash.get('posts');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['post']=value;if(stash.get(['post',0,'id',0])<stash.get('current')){stash.set('prev_post',stash.get('post'));}
else{stash.set('next_post',stash.get('post'));};retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();if(stash.get('next_post')){output+='\n<a href="#post-';output+=stash.get(['next_post',0,'id',0]);output+='">\n    « ';output+=stash.get(['next_post',0,'title',0]);output+='\n</a>\n';}
output+='\n |\n<a href="#post-list"> Main </a>\n |\n';if(stash.get('prev_post')){output+='\n<a href="#post-';output+=stash.get(['prev_post',0,'id',0]);output+='">\n    ';output+=stash.get(['prev_post',0,'title',0]);output+=' »\n</a>\n';}
output+='\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['pager.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{stash.set('page',1,1);stash.set('page_count',stash.get('undef'),1);stash.set('title','Pages',1);output+='\n';if(stash.get('page_count')<=10){stash.set('from',1);stash.set('to',stash.get('page_count'));}
else{stash.set('from',stash.get('page')-10>=1?stash.get('page')-10:1);stash.set('to',stash.get('page')+9>=stash.get('page_count')?stash.get('page_count'):stash.get('page')+9);}
output+='\n<center>\n  <table class="paging">\n    <tr>\n      <td>\n        ';output+=stash.get('title');output+=':&nbsp; &nbsp;\n      </td>\n      <td>';if(stash.get('page')>1){output+='\n        <span class="prev-page">\n            <a href="#post-list-';output+=stash.get('page')-1;output+='">Previous</a>\n        </span>';}
output+='\n      </td>\n';stash.set('i',stash.get('from'));var failsafe=1000;while(--failsafe&&(stash.get('i')<=stash.get('to'))){if(stash.get('i')==stash.get('page')){output+='\n        <td class="highlight">';output+=stash.get('i');output+='</td>';}
else{output+='\n        <td><a href="#post-list-';output+=stash.get('i');output+='">';output+=stash.get('i');output+='</a></td>';}
stash.set('i',stash.get('i')+1);}
if(!failsafe)
throw("WHILE loop terminated (> 1000 iterations)\n")
output+='\n\n      <td>';if(stash.get('page')<stash.get('page_count')){output+='\n        <span class="next-page">\n            <a href="#post-list-';output+=stash.get('page')+1;output+='">Next</a>\n        </span>';}
output+='\n      </td>\n    </tr>\n  </table>\n</center>\n<br/>\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['post-list.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<div id="post-list-nav" class="content-nav"></div>\n';(function(){var list=stash.get('post_list');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['post']=value;output+='\n    ';output+=context.process('post.tt');output+='\n';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['post-page.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<p class="content-nav">\n</p>\n<!-- entry -->\n\n';output+=context.process('post.tt');output+='\n<a id="post-';output+=stash.get(['post',0,'id',0]);output+=':comments" name="post-';output+=stash.get(['post',0,'id',0]);output+='-comments"></a>\n    <div class="comments">\n        <h3 class="comments-header">Comments</h3>\n        <div class="comments-content">\n        <!-- comment list -->\n        </div>\n    </div>\n    <!-- comment form -->\n    <form id="comment-form" onsubmit="return false;" method="post">\n        <div class="comments-open">\n            <input id="comment-for" type="hidden" value="';output+=stash.get(['post',0,'id',0]);output+='"></input>\n            <h2 class="comments-open-header">Post a comment</h2>\n            <div class="comments-open-content">\n                <div id="comments-open-data">\n                <p>\n                    <label for="comment-author">Name:</label>\n                    <input id="comment-author" name="author" size="30" class="required"/>\n                </p>\n                <p>\n\n                    <label for="comment-email">Email Address: <span class="comment-form-note">(Not displayed with comment.)</span></label>\n                    <input id="comment-email" name="email" size="30" class="required" />\n                </p>\n                <p>\n                    <label for="comment-url">URL:</label>\n                    <input id="comment-url" name="url" size="30" />\n                </p>\n\n                <p>\n                    <label for="comment-bake-cookie"><input type="checkbox"\n                        id="comment-bake-cookie" name="bakecookie" value="1" />\n                        Remember personal info?</label>\n                </p>\n                </div>\n\n                <p id="comments-open-text">\n                    <label for="comment-text">Comments:</label>\n                    <textarea id="comment-text" name="text" rows="10" cols="30" class="required"></textarea>\n                </p>\n            </div>\n\n            <div id="comments-open-footer" class="comments-open-footer">\n                <!-- <button name="preview" id="comment-preview">&nbsp;Preview&nbsp;</button> -->\n                <button name="post" id="comment-post" onclick="postComment(';output+=stash.get(['post',0,'id',0]);output+=');">&nbsp;Post&nbsp;</button>\n            </div>\n\n        </div>\n    </form>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['post.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<h2 class="date-header">';output+=stash.get(['post',0,'created',0]);output+='</h2>\n<div class="entry">\n    <h3 class="entry-header">\n        <a href="#post-';output+=stash.get(['post',0,'id',0]);output+='">';output+=stash.get(['post',0,'title',0]);output+='        </a>\n    </h3>\n    <div class="entry-content">\n        <div class="entry-body">';output+=stash.get(['post',0,'content',0]);output+='            <p/>\n        </div>\n    </div>\n    <div class="entry-footer">\n        <p class="entry-footer-info">\n            <span class="post-footers">\n                Posted by ';output+=stash.get(['post',0,'author',0]);output+=' at\n                ';output+=stash.get(['post',0,'created',0]);output+=' in\n                <a href="#post-';output+=stash.get(['post',0,'id',0]);output+='">Articles</a>\n            </span>\n            <span class="separator">|</span>\n            <a class="permalink" href="#post-';output+=stash.get(['post',0,'id',0]);output+='">Permalink</a>\n            <span class="separator">|</span>\n            <a href="#post-';output+=stash.get(['post',0,'id',0]);output+=':comments">Comments\n                (<span class="comment-count" post="';output+=stash.get(['post',0,'id',0]);output+='">';output+=stash.get(['post',0,'comments',0]);output+='</span>)\n            </a>\n        </p>\n        <!-- technorati tags -->\n        <!-- post footer links -->\n    </div>\n</div>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['recent-comments.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<ul class="module-list">\n';output+=stash.get('last_id');output+='\n';(function(){var list=stash.get('comments');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['comment']=value;output+='    <li class="module-list-item">\n        <a href="#post-';output+=stash.get(['comment',0,'post',0]);output+=':comment-';output+=stash.get(['comment',0,'id',0]);output+='">\n        ';output+=(function(){var output='';output+=stash.get(['comment',0,'sender',0]);return context.filter(output,'html',[]);})();output+='</a> on\n        <a href="#post-';output+=stash.get(['comment',0,'post',0]);output+='">';output+=(function(){var output='';output+=stash.get(['comment',0,'title',0]);return context.filter(output,'html',[]);})();output+='</a>\n    </li>';stash.set('last_id',stash.get(['comment',0,'id',0]));output+='\n';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='</ul>\n\n<p class="module-more">\n\n';if(stash.get('offset')>0){output+='\n    <a href="javascript:getRecentComments(';output+=stash.get('offset')-stash.get('count');output+=')">&lt;&lt</a>\n';}
output+='\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n';if(stash.get('last_id')>1&&stash.get(['comments',0,'size',0])==stash.get('count')){output+='\n    <a id="more-recent-comments" href="javascript:getRecentComments(';output+=stash.get('offset')+stash.get('count');output+=');">\n    Next...\n    </a>\n';}
output+='\n\n</p>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
Jemplate.templateMap['recent-posts.tt']=function(context){if(!context)throw('Jemplate function called without context\n');var stash=context.stash;var output='';try{output+='<ul class="module-list">\n';output+=stash.get('last_id');output+='\n';(function(){var list=stash.get('posts');list=new Jemplate.Iterator(list);var retval=list.get_first();var value=retval[0];var done=retval[1];var oldloop;try{oldloop=stash.get('loop')}finally{}
stash.set('loop',list);try{while(!done){stash.data['post']=value;output+='    <li class="module-list-item">\n        <a href="#post-';output+=stash.get(['post',0,'id',0]);output+='">';output+=stash.get(['post',0,'title',0]);output+='</a>\n    </li>';stash.set('last_id',stash.get(['post',0,'id',0]));output+='\n';;retval=list.get_next();value=retval[0];done=retval[1];}}
catch(e){throw(context.set_error(e,output));}
stash.set('loop',oldloop);})();output+='</ul>\n\n<p class="module-more">\n\n';if(stash.get('offset')>0){output+='\n    <a href="javascript:getRecentPosts(';output+=stash.get('offset')-stash.get('count');output+=')">&lt;&lt;</a>\n';}
output+='\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n&nbsp; &nbsp;\n';if(stash.get('last_id')>1&&stash.get(['posts',0,'size',0])==stash.get('count')){output+='\n    <a id="more-recent-posts" href="javascript:getRecentPosts(';output+=stash.get('offset')+stash.get('count');output+=');">\n    Next...\n    </a>\n';}
output+='\n\n</p>\n\n';}
catch(e){var error=context.set_error(e,output);throw(error);}
return output;}
if(typeof window.OpenResty=="undefined"){window.undefined=window.undefined;var OpenResty={callbackMap:{},isDone:{}};OpenResty.Client=function(params){if(params==undefined)params={};this.callback=params.callback;var server=params.server;if(!/^https?:\/\//.test(server)){server='http://'+server;}
this.server=server;this.user=params.user;};OpenResty.Client.prototype.isSuccess=function(res){return!(typeof res=='object'&&res.success==0&&res.error);};OpenResty.Client.prototype.logout=function(){this.get('/=/logout');};OpenResty.Client.prototype.login=function(user,password){this.user=user;var userCallback=this.callback;if(typeof userCallback=='string'){userCallback=eval(userCallback);}
var self=this;this.callback=function(data){self.session=data.session;userCallback(data);};if(password==null)
password='';else
password=hex_md5(password);this.get('/=/login/'+user+'/'+password);};OpenResty.Client.prototype.postByGet=function(url){var args,content;if(arguments.length==3){args=arguments[1];content=arguments[2];}else{content=arguments[1];}
if(!args)args={};url=url.replace(/^\/=\//,'/=/post/');content=JSON.stringify(content);args._data=content;this.get(url,args);};OpenResty.Client.prototype.post=function(url){var args,content;if(arguments.length==3){args=arguments[1];content=arguments[2];}else{content=arguments[1];}
if(!args)args={};if(url.match(/\?/))throw"URL should not contain '?'.";if(!this.callback)throw"No callback specified for OpenResty.";var formId=this.formId;if(!formId)throw"No form specified.";if(this.session)args._session=this.session;if(!this.session&&!args._user)
args._user=this.user;args._last_response=Math.round(Math.random()*1000000);content=JSON.stringify(content);var arg_list=new Array();for(var key in args){arg_list.push(key+"="+encodeURIComponent(args[key]));}
url+="?"+arg_list.join("&");var self=this;var form=document.getElementById(formId);form.method='POST';var ts=dojo.io.iframe.send({form:form,url:this.server+url,content:{data:content},preventCache:true,method:"post",handleAs:'html',handle:function(){self.get('/=/last/response/'+args._last_response);}});};OpenResty.Client.prototype.putByGet=function(url){var args,content;if(arguments.length==3){args=arguments[1];content=arguments[2];}else{content=arguments[1];}
if(!args)args={};url=url.replace(/^\/=\//,'/=/put/');content=JSON.stringify(content);args._data=content;this.get(url,args);};OpenResty.Client.prototype.put=function(url){var args,content;if(arguments.length==3){args=arguments[1];content=arguments[2];}else{content=arguments[1];}
if(!args)args={};url=url.replace(/^\/=\//,'/=/put/');this.post(content,url,args);};OpenResty.Client.prototype.get=function(url,args){if(!args)args={};if(!this.callback)throw"No callback specified for OpenResty.";if(!this.server)throw"No server specified for OpenResty.";if(this.session)args._session=this.session;if(!this.session&&!args._user)
args._user=this.user;if(url.match(/\?/))throw"URL should not contain '?'.";var reqId=Math.round(Math.random()*100000);var onerror=this.onerror;if(onerror==null)
onerror=function(){alert("Failed to do GET "+url)};var callback=this.callback;if(typeof callback=='string'){callback=eval(callback);}
OpenResty.isDone[reqId]=false;this.callback=function(res){OpenResty.isDone[reqId]=true;OpenResty.callbackMap[reqId]=null;callback(res);};OpenResty.callbackMap[reqId]=this.callback;args._callback="OpenResty.callbackMap["+reqId+"]";var headTag=document.getElementsByTagName('head')[0];var scriptTag=document.createElement("script");scriptTag.id="openapiScriptTag"+reqId;scriptTag.className='_openrestyScriptTag';var arg_list=new Array();for(var key in args){arg_list.push(key+"="+encodeURIComponent(args[key]));}
scriptTag.src=this.server+url+"?"+arg_list.join("&");scriptTag.type="text/javascript";scriptTag.onload=scriptTag.onreadystatechange=function(){var done=OpenResty.isDone[reqId];if(done){setTimeout(function(){try{headTag.removeChild(scriptTag);}catch(e){}},0);return;}
if(!this.readyState||this.readyState=="loaded"||this.readyState=="complete"){setTimeout(function(){if(!OpenResty.isDone[reqId]){onerror();OpenResty.isDone[reqId]=true;setTimeout(function(){try{headTag.removeChild(scriptTag);}catch(e){}},0);}},50);}};headTag.appendChild(scriptTag);};OpenResty.Client.prototype.del=function(url,args){if(!args)args={};url=url.replace(/^\/=\//,'/=/delete/');this.get(url,args);};OpenResty.Client.prototype.purge=function(){OpenResty.callbackMap={};OpenResty.isDone={};var nodes=document.getElementsByTagName('script');for(var i=0;i<nodes.length;i++){var node=nodes[i];if(node.className=='_openrestyScriptTag'){node.parentNode.removeChild(node);}}};}
var account='agentzh';var host='http://api.eeeeworks.org';var openresty=null;var savedAnchor=null;var itemsPerPage=5;var loadingCount=0;var waitMessage=null;var timer=null;var thisYear=null;var thisMonth=null;var thisDay=null;var months=[null,'January','February','March','April','May','June','July','August','September','October','November','December'];$(window).ready(init);function error(msg){alert(msg);}
function debug(msg){$("#copyright").append(msg+"<br/>");}
$.fn.postprocess=function(className,options){return this.find("a[@href^='#']").each(function(){var href=$(this).attr('href');var anchor=href.replace(/^.*?\#/,'');$(this).click(function(){location.hash=anchor;if(savedAnchor==anchor)savedAnchor=null;dispatchByAnchor();});});};function setStatus(isLoading,category){if(isLoading){if(++loadingCount==1){if(jQuery.browser.opera)
$(waitMessage).css('top','2px');else
$(waitMessage).show();}}else{loadingCount--;if(loadingCount<0)loadingCount=0;if(loadingCount==0){if(jQuery.browser.opera)
$(waitMessage).css('top','-200px');else
$(waitMessage).hide();}}}
function init(){loadingCount=0;var now=new Date();thisYear=now.getFullYear();thisMonth=now.getMonth();thisDay=now.getDate();waitMessage=document.getElementById('wait-message');openresty=new OpenResty.Client({server:host,user:account+'.Public'});if(timer){clearInterval(timer);}
dispatchByAnchor();timer=setInterval(dispatchByAnchor,600);getSidebar();}
function resetAnchor(){var anchor=location.hash;location.hash=anchor.replace(/^\#/,'');}
function dispatchByAnchor(){var anchor=location.hash;anchor=anchor.replace(/^\#/,'');if(savedAnchor==anchor)
return;if(anchor==""){anchor='main';location.hash='main';}
savedAnchor=anchor;loadingCount=0;var match=anchor.match(/^post-(\d+)(:comments|comment-(\d+))?/);if(match){var postId=match[1];getPost(postId);return;}
match=anchor.match(/^archive-(\d+)-(\d+)$/);if(match){var year=match[1];var month=match[2];getArchive(year,month);return;}
match=anchor.match(/^(?:post-list|post-list-(\d+))$/);var page=1;if(match)
page=parseInt(match[1])||1;else if(anchor!='main')
top.location.hash='main';getPostList(page);getPager(page);$(".blog-top").attr('id','post-list-'+page);}
function getArchive(year,month){setStatus(true,'renderPostList');$(".pager").html('');openresty.callback=function(res){renderPostList(res);setStatus(true,'renderArchiveNav');openresty.callback=renderArchiveNav;openresty.get('/=/view/PrevNextArchive/~/~',{now:year+'-'+month+'-01',month:month,months:months});};openresty.get('/=/view/FullPostsByMonth/~/~',{count:40,year:year,month:month});$(".blog-top").attr('id','archive-'+year+'-'+month);}
function renderArchiveNav(res){setStatus(false,'renderArchiveNav');if(!openresty.isSuccess(res)){error("Failed to get archive navigator: "+res.error);return;}
var prev=null;var next=null;for(var i=0;i<res.length;i++){var item=res[i];item.year=parseInt(item.year);item.month=parseInt(item.month);if(item.id=="prev")prev=item;else if(item.id=="next")next=item;}
$("#post-list-nav").html(Jemplate.process('archive-nav.tt',{next:next,prev:prev,months:months})).postprocess();}
function getPostList(page){setStatus(true,'renderPostList');openresty.callback=renderPostList;openresty.get('/=/model/Post/~/~',{_count:itemsPerPage,_order_by:'id:desc',_offset:itemsPerPage*(page-1)});}
function getPager(page){setStatus(true,'renderPager');openresty.callback=function(res){renderPager(res,page);};openresty.get('/=/view/RowCount/model/Post');}
function getSidebar(){getCalendar();getRecentPosts();getRecentComments();getArchiveList();}
function getCalendar(year,month){if(year==undefined||month==undefined){year=thisYear;month=thisMonth;}
var date=new Date(year,month,1);var first_day_of_week=date.getDay();var end_of_month;if(month==11){end_of_month=31;}else{var delta=new Date(year,month+1,1)-date;end_of_month=Math.round(delta/1000/60/60/24);}
$(".module-calendar").html(Jemplate.process('calendar.tt',{year:year,month:month,first_day_of_week:first_day_of_week,end_of_month:end_of_month,today:(year==thisYear&&month==thisMonth)?thisDay:null,months:months})).postprocess();setTimeout(function(){setStatus(true,'renderPostsInCalendar');openresty.callback=function(res){renderPostsInCalendar(res,year,month);};openresty.get('/=/view/PostsByMonth/~/~',{year:year,month:month+1});},0);}
function renderPostsInCalendar(res,year,month){setStatus(false,'renderPostsInCalendar');if(!openresty.isSuccess(res)){error("Failed to fetch posts for calendar: "+
res.error);}else{var prev_day=0;for(var i=0;i<res.length;i++){var line=res[i];if(prev_day==line.day)continue;prev_day=line.day;var id='day-'+year+'-'+month+'-'+line.day;var cell=$("#"+id);if(cell.length==0)return;cell.html('<a href="#post-'+line.id+'"><b>'+
cell.html()+'</b></a>').postprocess();}}}
function getRecentComments(offset){if(!offset)offset=0;setStatus(true,'renderRecentComments');openresty.callback=function(res){renderRecentComments(res,offset,6)};openresty.get('/=/view/RecentComments/limit/6',{offset:offset});}
function renderRecentComments(res,offset,count){setStatus(false,'renderRecentComments');if(!openresty.isSuccess(res)){error("Failed to get the recent comments: "+res.error);}else{var html=Jemplate.process('recent-comments.tt',{comments:res,offset:offset,count:count});$("#recent-comments").html(html).postprocess();}}
function getRecentPosts(offset){if(!offset)offset=0;setStatus(true,'renderRecentPosts');openresty.callback=function(res){renderRecentPosts(res,offset,6)};openresty.get('/=/view/RecentPosts/limit/6',{offset:offset});}
function renderRecentPosts(res,offset,count){setStatus(false,'renderRecentPosts');if(!openresty.isSuccess(res)){error("Failed to get the recent posts: "+res.error);}else{var html=Jemplate.process('recent-posts.tt',{posts:res,offset:offset,count:count});$("#recent-posts").html(html).postprocess();}}
function getArchiveList(offset){if(offset==undefined)offset=0;setStatus(true,'getArchiveList');openresty.callback=function(res){renderArchiveList(res,offset,12);};openresty.get('/=/view/PostCountByMonths/~/~',{offset:offset,count:12});}
function renderArchiveList(res,offset,count){setStatus(false,'getArchiveList');if(!openresty.isSuccess(res)){error("Failed to get archive list: "+res.error);return;}
for(var i=0;i<res.length;i++){var item=res[i];var match=item.year_month.match(/^(\d\d\d\d)-0?(\d+)/);if(match){item.year=parseInt(match[1]);item.month=parseInt(match[2]);}else{error("Failed to match against year_month: "+item.year_month);}}
$("#archive-list").html(Jemplate.process('archive-list.tt',{archives:res,count:count,offset:offset,months:months})).postprocess();}
function postComment(form){var data={};data.sender=$("#comment-author").val();data.email=$("#comment-email").val();data.url=$("#comment-url").val();data.body=$("#comment-text").val();data.post=$("#comment-for").val();if(!data.sender){error("Name is required.");return false;}
if(!data.email){error("Email address is required.");return false;}
if(!data.body){error("Comment body is required.");return false;}
setStatus(true,'afterPostComment');openresty.callback=afterPostComment;openresty.postByGet('/=/model/Comment/~/~',data);return false;}
function afterPostComment(res){setStatus(false,'afterPostComment');if(!openresty.isSuccess(res)){error("Failed to post the comment: "+res.error);}else{$("#comment-text").val('');var spans=$(".comment-count");var commentCount=parseInt(spans.text());var postId=spans.attr('post');var commentId;var match=res.last_row.match(/\d+$/);if(match.length)commentId=match[0];location.hash='post-'+postId+':'+
(commentId?'comment-'+commentId:'comments');openresty.callback=function(res){if(!openresty.isSuccess(res)){error("Failed to increment the comment count for post "+
postId+": "+res.error);}else{spans.text(commentCount+1);}};openresty.putByGet('/=/model/Post/id/'+postId,{comments:commentCount+1});getRecentComments(0);}}
function getPost(id){$(".blog-top").attr('id','post-'+id);setStatus(true,'renderPost');openresty.callback=renderPost;openresty.get('/=/model/Post/id/'+id);}
function renderPost(res){setStatus(false,'renderPost');if(!openresty.isSuccess(res)){error("Failed to render post: "+res.error);}else{var post=res[0];$("#beta-inner.pkg").html(Jemplate.process('post-page.tt',{post:post})).postprocess();openresty.callback=function(res){renderPrevNextPost(post.id,res);};openresty.get('/=/view/PrevNextPost/current/'+post.id);setStatus(true,'renderComments');openresty.callback=renderComments;openresty.get('/=/model/Comment/post/'+post.id);$(".pager").html('');}}
function renderPrevNextPost(currentId,res){if(!openresty.isSuccess(res)){error("Failed to render prev next post navigation: "+
res.error);}else{$(".content-nav").html(Jemplate.process('nav.tt',{posts:res,current:currentId})).postprocess();resetAnchor();}}
function renderComments(res){setStatus(false,'renderComments');if(!openresty.isSuccess(res)){error("Failed to render post list: "+res.error);}else{$(".comments-content").html(Jemplate.process('comments.tt',{comments:res}));resetAnchor();}}
function renderPostList(res){setStatus(false,'renderPostList');if(!openresty.isSuccess(res)){error("Failed to render post list: "+res.error);}else{$("#beta-inner.pkg").html(Jemplate.process('post-list.tt',{post_list:res})).postprocess();}
resetAnchor();}
function renderPager(res,page){setStatus(false,'renderPager');if(!openresty.isSuccess(res)){error("Failed to render pager: "+res.error);}else{var pageCount=Math.ceil(parseInt(res[0].count)/itemsPerPage);if(pageCount<2)return;var html=Jemplate.process('pager.tt',{page:page,page_count:pageCount,title:'Pages'});$(".pager").each(function(){$(this).html(html).postprocess();});resetAnchor();}}