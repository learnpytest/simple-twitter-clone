(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-73728c7a"],{"09e4":function(t,e,a){"use strict";a("99af"),a("b0c0");e["a"]={generalErrorHandler:function(t){return function(e){t instanceof Error?e.$store.dispatch("ADD_NOTIFICATION",{type:"error",message:"".concat(t.name,": ").concat(t.message)}):e.$store.dispatch("ADD_NOTIFICATION",{type:"error",message:"".concat(t)})}}}},"133c":function(t,e,a){},"189f":function(t,e,a){},"214b":function(t,e,a){t.exports=a.p+"img/icon_close.883c7712.svg"},"52d0":function(t,e,a){"use strict";a("189f")},5899:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,e,a){var n=a("e330"),r=a("1d80"),s=a("577e"),i=a("5899"),c=n("".replace),o="["+i+"]",l=RegExp("^"+o+o+"*"),u=RegExp(o+o+"*$"),d=function(t){return function(e){var a=s(r(e));return 1&t&&(a=c(a,l,"")),2&t&&(a=c(a,u,"")),a}};t.exports={start:d(1),end:d(2),trim:d(3)}},8624:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",{staticClass:"new-tweet-modal",on:{submit:function(e){return e.stopPropagation(),e.preventDefault(),t.handleTweetSubmit.apply(null,arguments)}}},[n("div",{staticClass:"new-text-box"},[n("div",{staticClass:"close-btn"},[n("button",[n("img",{attrs:{src:a("214b"),alt:""},on:{click:t.handleShowModalClick}})])]),n("div",{staticClass:"text-box"},[n("div",{staticClass:"user-info"},[n("img",{staticClass:"user-pic",attrs:{src:t._f("emptyImage")(t.currentUserPic),alt:""}})]),n("div",{staticClass:"text-area"},[n("textarea",{directives:[{name:"model",rawName:"v-model",value:t.text,expression:"text"}],staticClass:"form-control",attrs:{rows:"3",maxlength:"141",placeholder:"有什麽新鮮事？"},domProps:{value:t.text},on:{click:function(e){return e.stopPropagation(),e.preventDefault(),t.resetEmpty.apply(null,arguments)},input:function(e){e.target.composing||(t.text=e.target.value)}}}),n("span",{staticClass:"limiter"},[t._v(t._s(t.charactersLeft))])])]),n("div",{staticClass:"tweet-btn"},[t.text.length>=140?n("p",[t._v("字數不可超過 140 字")]):t._e(),t.submitEmptyField?n("p",[t._v("內容不可空白")]):t._e(),n("button",[t._v("推文")])])])])},r=[],s=a("5530"),i=a("1da1"),c=(a("96cf"),a("5fad")),o=a("6783"),l=a("2f62"),u=a("6ad5"),d=a("ac0d"),f={mixins:[d["a"],d["e"]],props:{initialShowModal:{type:Boolean,required:!0}},data:function(){return{showModal:"",limit:-1,text:"",currentUserId:"",submitEmptyField:!1,currentUserPic:{},currentUser:{}}},created:function(){this.fetchData(),this.fetchCurrentUser()},methods:{fetchData:function(){this.showModal=this.initialShowModal},fetchCurrentUser:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a,n,r,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,c["a"].getCurrentUser();case 3:a=e.sent,n=a.data,r=n.avatar,s=n.id,t.currentUserId=s,t.currentUserPic=r,t.currentUser=a.data,e.next=13;break;case 10:e.prev=10,e.t0=e["catch"](0),console.log("error",e.t0);case 13:case"end":return e.stop()}}),e,null,[[0,10]])})))()},handleShowModalClick:function(){this.showModal?(this.showModal=!1,this.$emit("show-modal")):(this.showModal=!0,this.$emit("show-modal"))},handleTweetSubmit:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.text.length){e.next=3;break}return t.submitEmptyField=!0,e.abrupt("return");case 3:if(!(t.text.length>140)){e.next=5;break}return e.abrupt("return");case 5:return e.prev=5,e.next=8,o["a"].postOneUserTweet({description:t.text});case 8:if(a=e.sent,n=a.data,"success"===n.status){e.next=12;break}throw new Error(n.message);case 12:t.$emit("updateData"),t.socketSendCommunityOneNotification("5",t.currentUser,null,t.text),e.next=19;break;case 16:e.prev=16,e.t0=e["catch"](5),console.log("error",e.t0);case 19:case"end":return e.stop()}}),e,null,[[5,16]])})))()},resetEmpty:function(){this.submitEmptyField=!1}},computed:Object(s["a"])({charactersLeft:function(){var t=this.text.length,e=140;return e-t+" / "+e+"剩餘字數"}},Object(l["c"])({getCurrentUser:u["q"]}))},m=f,p=(a("52d0"),a("2877")),v=Object(p["a"])(m,n,r,!1,null,"0225860c",null);e["a"]=v.exports},"99af":function(t,e,a){"use strict";var n=a("23e7"),r=a("da84"),s=a("d039"),i=a("e8b5"),c=a("861d"),o=a("7b0b"),l=a("07fa"),u=a("8418"),d=a("65f0"),f=a("1dde"),m=a("b622"),p=a("2d00"),v=m("isConcatSpreadable"),h=9007199254740991,g="Maximum allowed index exceeded",_=r.TypeError,C=p>=51||!s((function(){var t=[];return t[v]=!1,t.concat()[0]!==t})),b=f("concat"),x=function(t){if(!c(t))return!1;var e=t[v];return void 0!==e?!!e:i(t)},U=!C||!b;n({target:"Array",proto:!0,forced:U},{concat:function(t){var e,a,n,r,s,i=o(this),c=d(i,0),f=0;for(e=-1,n=arguments.length;e<n;e++)if(s=-1===e?i:arguments[e],x(s)){if(r=l(s),f+r>h)throw _(g);for(a=0;a<r;a++,f++)a in s&&u(c,f,s[a])}else{if(f>=h)throw _(g);u(c,f++,s)}return c.length=f,c}})},"9dd4":function(t,e,a){t.exports=a.p+"img/Logo_small.21c0a93a.svg"},a357:function(t,e,a){t.exports=a.p+"img/icon_chat.6e17a436.svg"},bf0d:function(t,e,a){t.exports=a.p+"img/icon_cog.2ff65de4.svg"},c00e:function(t,e,a){t.exports=a.p+"img/btn_noti.d84f3623.svg"},c4cd:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"sidebar-wrapper"},[n("ul",{staticClass:"nav-links"},[n("li",[n("router-link",{attrs:{to:"#"}},[n("img",{staticClass:"logo",attrs:{src:a("9dd4"),alt:""}})])],1),n("li",[n("router-link",{attrs:{to:{name:"UserMain"}}},[n("div",{staticClass:"nav-link"},[n("img",{staticClass:"filter-orange",attrs:{src:a("dffc"),alt:""}}),n("p",{staticClass:"nav-link_text"},[t._v("首頁")])])])],1),n("li",[n("router-link",{attrs:{to:{name:"user",params:{id:t.currentUserId}}}},[n("div",{staticClass:"nav-link"},[n("img",{staticClass:"filter-orange",attrs:{src:a("8f36"),alt:""}}),n("p",{staticClass:"nav-link_text"},[t._v("個人資料")])])])],1),n("li",[n("router-link",{attrs:{to:{name:"community"}}},[n("div",{staticClass:"nav-link community"},[n("span",{staticClass:"community__icon"},[n("img",{attrs:{src:a("c00e"),alt:""}}),t.notificationUnread.communityNotification?n("span",{staticClass:"community__notification"},[t._v(t._s(t.notificationUnread.communityNotification))]):t._e()]),n("p",{staticClass:"nav-link_text"},[t._v("通知")])])])],1),n("li",[n("router-link",{attrs:{to:{name:"public-room"}}},[n("div",{staticClass:"nav-link community"},[n("span",{staticClass:"community__icon"},[n("img",{staticClass:"filter-orange",attrs:{src:a("a357"),alt:""}}),t.notificationUnread.publicMessage?n("span",{staticClass:"community__notification"},[t._v(t._s(t.notificationUnread.publicMessage))]):t._e()]),n("p",{staticClass:"nav-link_text"},[t._v("公開聊天室")])])])],1),n("li",[n("router-link",{attrs:{to:{name:"private-room"}}},[n("div",{staticClass:"nav-link community"},[n("span",{staticClass:"community__icon"},[n("img",{staticClass:"filter-orange",attrs:{src:a("a357"),alt:""}}),t.sumUpOfUnreadPrivateMessages>0?n("span",{staticClass:"community__notification"},[t._v(t._s(t.sumUpOfUnreadPrivateMessages))]):t._e()]),n("p",{staticClass:"nav-link_text"},[t._v("私人訊息")])])])],1),n("li",[n("router-link",{attrs:{to:{name:"user-setting"}}},[n("div",{staticClass:"nav-link"},[n("img",{staticClass:"filter-orange",attrs:{src:a("bf0d"),alt:""}}),n("p",{staticClass:"nav-link_text"},[t._v("設定")])])])],1),n("li",{staticClass:"nav-link"},[n("button",{on:{click:t.handleShowModalClick}},[t._v("推文")])])]),n("div",{staticClass:"logout",on:{click:t.logout}},[n("router-link",{attrs:{to:"#"}},[n("div",{staticClass:"nav-link"},[n("img",{staticClass:"filter-orange",attrs:{src:a("f667"),alt:""}}),n("p",{staticClass:"nav-link_text"},[t._v("登出")])])])],1)])},r=[],s=a("5530"),i=a("1da1"),c=(a("96cf"),a("d3b7"),a("d81d"),a("25f0"),a("56d7")),o=a("2f62"),l=a("6ad5"),u=a("5fad"),d=a("ac0d"),f=a("09e4"),m={name:"Sidebar",mixins:[d["f"]],props:{initialShowModal:{type:Boolean,required:!0}},sockets:{displayUnreadNotification:function(t){this.$store.dispatch("SET_COMMUNITY_NOTIFICATION_UNREAD",t)},unreadNotificationPublicMessageAddOne:function(){this.$store.dispatch("INCREMENT_COMMUNITY_NOTIFICATION_UNREAD_PUBLIC_MESSAGE")},displayAllUnreadPrivateMessages:function(t){var e=t.map((function(t){return t.unread})).reduce((function(t,e){return t+e}),0);this.$store.dispatch("SET_SUM_OF_UNREAD_PRIVATE_MESSAGES",e)},allUnreadPrivateMessagesSumAddOne:function(){this.$store.dispatch("SET_SUM_OF_UNREAD_PRIVATE_MESSAGES",this.sumUpOfUnreadPrivateMessages+1)}},data:function(){return{showModal:"",currentUserId:"",sum:0}},created:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.getCurrentUser();case 3:return e.next=5,c["default"].emit("getUnreadNotification",t.currentUserId.toString());case 5:return e.next=7,c["default"].emit("getAllUnreadPrivateMessages",t.currentUserId);case 7:e.next=12;break;case 9:e.prev=9,e.t0=e["catch"](0),f["a"].generalErrorHandler("無法取得資料，請稍後再試")(t);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})))()},computed:Object(s["a"])({},Object(o["c"])({communityNotification:l["o"],notificationUnread:"GET_COMMUNITY_NOTIFICATION_UNREAD",sumUpOfUnreadPrivateMessages:"GET_SUM_OF_UNREAD_PRIVATE_MESSAGES"})),methods:Object(s["a"])(Object(s["a"])({},Object(o["b"])({revokeAuthentication:l["S"]})),{},{logout:function(){this.revokeAuthentication(),this.$router.push("/login")},handleShowModalClick:function(){this.showModal=!0,this.$emit("show-modal")},getCurrentUser:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,u["a"].getCurrentUser();case 3:if(a=e.sent,n=a.data,r=a.statusText,"OK"===r){e.next=7;break}throw new Error(r);case 7:t.currentUserId=n.id,e.next=13;break;case 10:e.prev=10,e.t0=e["catch"](0),console.log(e.t0);case 13:case"end":return e.stop()}}),e,null,[[0,10]])})))()}})},p=m,v=(a("fbe6"),a("2877")),h=Object(v["a"])(p,n,r,!1,null,"106eb749",null);e["a"]=h.exports},fbe6:function(t,e,a){"use strict";a("133c")}}]);
//# sourceMappingURL=chunk-73728c7a.79a37668.js.map