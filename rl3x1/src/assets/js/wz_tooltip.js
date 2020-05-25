function Tip() {
    tt_Tip(arguments, null)
}
function TagToTip() {
    var e = tt_GetElt(arguments[0]);
    if (e)
        tt_Tip(arguments, e)
}
function UnTip() {
    tt_OpReHref();
    if (tt_aV[DURATION] < 0 && tt_iState & 2)
        tt_tDurt.Timer("tt_HideInit()", -tt_aV[DURATION], true);
    else if (!(tt_aV[STICKY] && tt_iState & 2))
        tt_HideInit()
}
function tt_Extension() {
    tt_ExtCmdEnum();
    tt_aExt[tt_aExt.length] = this;
    return this
}
function tt_SetTipPos(e, t) {
    var n = tt_aElt[0].style;
    tt_x = e;
    tt_y = t;
    n.left = e + "px";
    n.top = t + "px";
    if (tt_ie56) {
        var r = tt_aElt[tt_aElt.length - 1];
        if (r) {
            r.style.left = n.left;
            r.style.top = n.top
        }
    }
}
function tt_HideInit() {
    if (tt_iState) {
        tt_ExtCallFncs(0, "HideInit");
        tt_iState &= ~(4 | 8);
        if (tt_flagOpa && tt_aV[FADEOUT]) {
            tt_tFade.EndTimer();
            if (tt_opa) {
                var e = Math.round(tt_aV[FADEOUT] / (tt_aV[FADEINTERVAL] * (tt_aV[OPACITY] / tt_opa)));
                tt_Fade(tt_opa, tt_opa, 0, e);
                return
            }
        }
        tt_tHide.Timer("tt_Hide();", 1, false)
    }
}
function tt_Hide() {
    if (tt_db && tt_iState) {
        tt_OpReHref();
        if (tt_iState & 2) {
            tt_aElt[0].style.visibility = "hidden";
            tt_ExtCallFncs(0, "Hide")
        }
        tt_tShow.EndTimer();
        tt_tHide.EndTimer();
        tt_tDurt.EndTimer();
        tt_tFade.EndTimer();
        if (!tt_op && !tt_ie) {
            tt_tWaitMov.EndTimer();
            tt_bWait = false
        }
        if (tt_aV[CLICKCLOSE] || tt_aV[CLICKSTICKY])
            tt_RemEvtFnc(document, "mouseup", tt_OnLClick);
        tt_ExtCallFncs(0, "Kill");
        if (tt_t2t && !tt_aV[COPYCONTENT])
            tt_UnEl2Tip();
        tt_iState = 0;
        tt_over = null;
        tt_ResetMainDiv();
        if (tt_aElt[tt_aElt.length - 1])
            tt_aElt[tt_aElt.length - 1].style.display = "none"
    }
}
function tt_GetElt(e) {
    return document.getElementById ? document.getElementById(e) : document.all ? document.all[e] : null
}
function tt_GetDivW(e) {
    return e ? e.offsetWidth || e.style.pixelWidth || 0 : 0
}
function tt_GetDivH(e) {
    return e ? e.offsetHeight || e.style.pixelHeight || 0 : 0
}
function tt_GetScrollX() {
    return window.pageXOffset || (tt_db ? tt_db.scrollLeft || 0 : 0)
}
function tt_GetScrollY() {
    return window.pageYOffset || (tt_db ? tt_db.scrollTop || 0 : 0)
}
function tt_GetClientW() {
    return tt_GetWndCliSiz("Width")
}
function tt_GetClientH() {
    return tt_GetWndCliSiz("Height")
}
function tt_GetEvtX(e) {
    return e ? typeof e.pageX != tt_u ? e.pageX : e.clientX + tt_GetScrollX() : 0
}
function tt_GetEvtY(e) {
    return e ? typeof e.pageY != tt_u ? e.pageY : e.clientY + tt_GetScrollY() : 0
}
function tt_AddEvtFnc(e, t, n) {
    if (e) {
        if (e.addEventListener)
            e.addEventListener(t, n, false);
        else
            e.attachEvent("on" + t, n)
    }
}
function tt_RemEvtFnc(e, t, n) {
    if (e) {
        if (e.removeEventListener)
            e.removeEventListener(t, n, false);
        else
            e.detachEvent("on" + t, n)
    }
}
function tt_GetDad(e) {
    return e.parentNode || e.parentElement || e.offsetParent
}
function tt_MovDomNode(e, t, n) {
    if (t)
        t.removeChild(e);
    if (n)
        n.appendChild(e)
}
function tt_Init() {
    tt_MkCmdEnum();
    if (!tt_Browser() || !tt_MkMainDiv())
        return;
    tt_IsW3cBox();
    tt_OpaSupport();
    tt_AddEvtFnc(document, "mousemove", tt_Move);
    if (TagsToTip || tt_Debug)
        tt_SetOnloadFnc();
    tt_AddEvtFnc(window, "unload", tt_Hide)
}
function tt_MkCmdEnum() {
    var n = 0;
    for (var i in config)
        eval("window." + i.toString().toUpperCase() + " = " + n++);
    tt_aV.length = n
}
function tt_Browser() {
    var n, nv, n6, w3c;
    n = navigator.userAgent.toLowerCase(), nv = navigator.appVersion;
    tt_op = document.defaultView && typeof eval("w" + "indow" + "." + "o" + "p" + "er" + "a") != tt_u;
    tt_ie = n.indexOf("msie") != -1 && document.all && !tt_op;
    if (tt_ie) {
        var ieOld = !document.compatMode || document.compatMode == "BackCompat";
        tt_db = !ieOld ? document.documentElement : document.body || null;
        if (tt_db)
            tt_ie56 = parseFloat(nv.substring(nv.indexOf("MSIE") + 5)) >= 5.5 && typeof document.body.style.maxHeight == tt_u
    } else {
        tt_db = document.documentElement || document.body || (document.getElementsByTagName ? document.getElementsByTagName("body")[0] : null);
        if (!tt_op) {
            n6 = document.defaultView && typeof document.defaultView.getComputedStyle != tt_u;
            w3c = !n6 && document.getElementById
        }
    }
    tt_body = document.getElementsByTagName ? document.getElementsByTagName("body")[0] : document.body || null;
    if (tt_ie || n6 || tt_op || w3c) {
        if (tt_body && tt_db) {
            if (document.attachEvent || document.addEventListener)
                return true
        } else
            tt_Err("wz_tooltip.js must be included INSIDE the body section," + " immediately after the opening <body> tag.", false)
    }
    tt_db = null;
    return false
}
function tt_MkMainDiv() {
    if (tt_body.insertAdjacentHTML)
        tt_body.insertAdjacentHTML("afterBegin", tt_MkMainDivHtm());
    else if (typeof tt_body.innerHTML != tt_u && document.createElement && tt_body.appendChild)
        tt_body.appendChild(tt_MkMainDivDom());
    if (window.tt_GetMainDivRefs && tt_GetMainDivRefs())
        return true;
    tt_db = null;
    return false
}
function tt_MkMainDivHtm() {
    return'<div id="WzTtDiV"></div>' + (tt_ie56 ? "" : "")
}
function tt_MkMainDivDom() {
    var e = document.createElement("div");
    if (e)
        e.id = "WzTtDiV";
    return e
}
function tt_GetMainDivRefs() {
    tt_aElt[0] = tt_GetElt("WzTtDiV");
    if (tt_ie56 && tt_aElt[0]) {
        tt_aElt[tt_aElt.length - 1] = tt_GetElt("WzTtIfRm");
        if (!tt_aElt[tt_aElt.length - 1])
            tt_aElt[0] = null
    }
    if (tt_aElt[0]) {
        var e = tt_aElt[0].style;
        e.visibility = "hidden";
        e.position = "absolute";
        e.overflow = "hidden";
        return true
    }
    return false
}
function tt_ResetMainDiv() {
    tt_SetTipPos(0, 0);
    tt_aElt[0].innerHTML = "";
    tt_aElt[0].style.width = "0px";
    tt_h = 0
}
function tt_IsW3cBox() {
    var e = tt_aElt[0].style;
    e.padding = "10px";
    e.width = "40px";
    tt_bBoxOld = tt_GetDivW(tt_aElt[0]) == 40;
    e.padding = "0px";
    tt_ResetMainDiv()
}
function tt_OpaSupport() {
    var e = tt_body.style;
    tt_flagOpa = typeof e.KhtmlOpacity != tt_u ? 2 : typeof e.KHTMLOpacity != tt_u ? 3 : typeof e.MozOpacity != tt_u ? 4 : typeof e.opacity != tt_u ? 5 : typeof e.filter != tt_u ? 1 : 0
}
function tt_SetOnloadFnc() {
    tt_AddEvtFnc(document, "DOMContentLoaded", tt_HideSrcTags);
    tt_AddEvtFnc(window, "load", tt_HideSrcTags);
    if (tt_body.attachEvent)
        tt_body.attachEvent("onreadystatechange", function() {
            if (tt_body.readyState == "complete")
                tt_HideSrcTags()
        });
    if (/WebKit|KHTML/i.test(navigator.userAgent)) {
        var e = setInterval(function() {
            if (/loaded|complete/.test(document.readyState)) {
                clearInterval(e);
                tt_HideSrcTags()
            }
        }, 10)
    }
}
function tt_HideSrcTags() {
    if (!window.tt_HideSrcTags || window.tt_HideSrcTags.done)
        return;
    window.tt_HideSrcTags.done = true;
    if (!tt_HideSrcTagsRecurs(tt_body))
        tt_Err("There are HTML elements to be converted to tooltips.\nIf you" + " want these HTML elements to be automatically hidden, you" + " must edit wz_tooltip.js, and set TagsToTip in the global" + " tooltip configuration to true.", true)
}
function tt_HideSrcTagsRecurs(e) {
    var t, n;
    var r = e.childNodes || e.children || null;
    for (var i = r ? r.length : 0; i; ) {
        --i;
        if (!tt_HideSrcTagsRecurs(r[i]))
            return false;
        t = r[i].getAttribute ? r[i].getAttribute("onmouseover") || r[i].getAttribute("onclick") : typeof r[i].onmouseover == "function" ? r[i].onmouseover || r[i].onclick : null;
        if (t) {
            n = t.toString().match(/TagToTip\s*\(\s*'[^'.]+'\s*[\),]/);
            if (n && n.length) {
                if (!tt_HideSrcTag(n[0]))
                    return false
            }
        }
    }
    return true
}
function tt_HideSrcTag(e) {
    var t, n;
    t = e.replace(/.+'([^'.]+)'.+/, "$1");
    n = tt_GetElt(t);
    if (n) {
        if (tt_Debug && !TagsToTip)
            return false;
        else
            n.style.display = "none"
    } else
        tt_Err("Invalid ID\n'" + t + "'\npassed to TagToTip()." + " There exists no HTML element with that ID.", true);
    return true
}
function tt_Tip(e, t) {
    if (!tt_db || tt_iState & 8)
        return;
    if (tt_iState)
        tt_Hide();
    if (!tt_Enabled)
        return;
    tt_t2t = t;
    if (!tt_ReadCmds(e))
        return;
    tt_iState = 1 | 4;
    tt_AdaptConfig1();
    tt_MkTipContent(e);
    tt_MkTipSubDivs();
    tt_FormatTip();
    tt_bJmpVert = false;
    tt_bJmpHorz = false;
    tt_maxPosX = tt_GetClientW() + tt_GetScrollX() - tt_w - 1;
    tt_maxPosY = tt_GetClientH() + tt_GetScrollY() - tt_h - 1;
    tt_AdaptConfig2();
    tt_OverInit();
    tt_ShowInit();
    tt_Move()
}
function tt_ReadCmds(e) {
    var t;
    t = 0;
    for (var n in config)
        tt_aV[t++] = config[n];
    if (e.length & 1) {
        for (t = e.length - 1; t > 0; t -= 2)
            tt_aV[e[t - 1]] = e[t];
        return true
    }
    tt_Err("Incorrect call of Tip() or TagToTip().\n" + "Each command must be followed by a value.", true);
    return false
}
function tt_AdaptConfig1() {
    tt_ExtCallFncs(0, "LoadConfig");
    if (!tt_aV[TITLEBGCOLOR].length)
        tt_aV[TITLEBGCOLOR] = tt_aV[BORDERCOLOR];
    if (!tt_aV[TITLEFONTCOLOR].length)
        tt_aV[TITLEFONTCOLOR] = tt_aV[BGCOLOR];
    if (!tt_aV[TITLEFONTFACE].length)
        tt_aV[TITLEFONTFACE] = tt_aV[FONTFACE];
    if (!tt_aV[TITLEFONTSIZE].length)
        tt_aV[TITLEFONTSIZE] = tt_aV[FONTSIZE];
    if (tt_aV[CLOSEBTN]) {
        if (!tt_aV[CLOSEBTNCOLORS])
            tt_aV[CLOSEBTNCOLORS] = new Array("", "", "", "");
        for (var e = 4; e; ) {
            --e;
            if (!tt_aV[CLOSEBTNCOLORS][e].length)
                tt_aV[CLOSEBTNCOLORS][e] = e & 1 ? tt_aV[TITLEFONTCOLOR] : tt_aV[TITLEBGCOLOR]
        }
        if (!tt_aV[TITLE].length)
            tt_aV[TITLE] = " "
    }
    if (tt_aV[OPACITY] == 100 && typeof tt_aElt[0].style.MozOpacity != tt_u && !Array.every)
        tt_aV[OPACITY] = 99;
    if (tt_aV[FADEIN] && tt_flagOpa && tt_aV[DELAY] > 100)
        tt_aV[DELAY] = Math.max(tt_aV[DELAY] - tt_aV[FADEIN], 100)
}
function tt_AdaptConfig2() {
    if (tt_aV[CENTERMOUSE]) {
        tt_aV[OFFSETX] -= tt_w - (tt_aV[SHADOW] ? tt_aV[SHADOWWIDTH] : 0) >> 1;
        tt_aV[JUMPHORZ] = false
    }
}
function tt_MkTipContent(e) {
    if (tt_t2t) {
        if (tt_aV[COPYCONTENT])
            tt_sContent = tt_t2t.innerHTML;
        else
            tt_sContent = ""
    } else
        tt_sContent = e[0];
    tt_ExtCallFncs(0, "CreateContentString")
}
function tt_MkTipSubDivs() {
    var e = "position:relative;margin:0px;padding:0px;border-width:0px;left:0px;top:0px;line-height:normal;width:auto;", t = ' cellspacing="0" cellpadding="0" border="0" style="' + e + '"><tbody style="' + e + '"><tr><td ';
    tt_aElt[0].style.width = tt_GetClientW() + "px";
    tt_aElt[0].innerHTML = "" + (tt_aV[TITLE].length ? '<div id="WzTiTl" style="position:relative;z-index:1;">' + '<table id="WzTiTlTb"' + t + 'id="WzTiTlI" style="' + e + '">' + tt_aV[TITLE] + "</td>" + (tt_aV[CLOSEBTN] ? '<td align="right" style="' + e + 'text-align:right;">' + '<span id="WzClOsE" style="position:relative;left:2px;padding-left:2px;padding-right:2px;' + "cursor:" + (tt_ie ? "hand" : "pointer") + ';" onmouseover="tt_OnCloseBtnOver(1)" onmouseout="tt_OnCloseBtnOver(0)" onclick="tt_HideInit()">' + tt_aV[CLOSEBTNTEXT] + "</span></td>" : "") + "</tr></tbody></table></div>" : "") + '<div id="WzBoDy" style="position:relative;z-index:0;">' + "<table" + t + 'id="WzBoDyI" style="' + e + '">' + tt_sContent + "</td></tr></tbody></table></div>" + (tt_aV[SHADOW] ? '<div id="WzTtShDwR" style="position:absolute;overflow:hidden;"></div>' + '<div id="WzTtShDwB" style="position:relative;overflow:hidden;"></div>' : "");
    tt_GetSubDivRefs();
    if (tt_t2t && !tt_aV[COPYCONTENT])
        tt_El2Tip();
    tt_ExtCallFncs(0, "SubDivsCreated")
}
function tt_GetSubDivRefs() {
    var e = new Array("WzTiTl", "WzTiTlTb", "WzTiTlI", "WzClOsE", "WzBoDy", "WzBoDyI", "WzTtShDwB", "WzTtShDwR");
    for (var t = e.length; t; --t)
        tt_aElt[t] = tt_GetElt(e[t - 1])
}
function tt_FormatTip() {
    var e, t, n, r = tt_aV[PADDING], i, s = tt_aV[BORDERWIDTH], o, u, a = r + s << 1;
    if (tt_aV[TITLE].length) {
        i = tt_aV[TITLEPADDING];
        e = tt_aElt[1].style;
        e.background = tt_aV[TITLEBGCOLOR];
        e.paddingTop = e.paddingBottom = i + "px";
        e.paddingLeft = e.paddingRight = i + 2 + "px";
        e = tt_aElt[3].style;
        e.color = tt_aV[TITLEFONTCOLOR];
        if (tt_aV[WIDTH] == -1)
            e.whiteSpace = "nowrap";
        e.fontFamily = tt_aV[TITLEFONTFACE];
        e.fontSize = tt_aV[TITLEFONTSIZE];
        e.fontWeight = "bold";
        e.textAlign = tt_aV[TITLEALIGN];
        if (tt_aElt[4]) {
            e = tt_aElt[4].style;
            e.background = tt_aV[CLOSEBTNCOLORS][0];
            e.color = tt_aV[CLOSEBTNCOLORS][1];
            e.fontFamily = tt_aV[TITLEFONTFACE];
            e.fontSize = tt_aV[TITLEFONTSIZE];
            e.fontWeight = "bold"
        }
        if (tt_aV[WIDTH] > 0)
            tt_w = tt_aV[WIDTH];
        else {
            tt_w = tt_GetDivW(tt_aElt[3]) + tt_GetDivW(tt_aElt[4]);
            if (tt_aElt[4])
                tt_w += r;
            if (tt_aV[WIDTH] < -1 && tt_w > -tt_aV[WIDTH])
                tt_w = -tt_aV[WIDTH]
        }
        o = -s
    } else {
        tt_w = 0;
        o = 0
    }
    e = tt_aElt[5].style;
    e.top = o + "px";
    if (s) {
        e.borderColor = tt_aV[BORDERCOLOR];
        e.borderStyle = tt_aV[BORDERSTYLE];
        e.borderWidth = s + "px"
    }
    if (tt_aV[BGCOLOR].length)
        e.background = tt_aV[BGCOLOR];
    if (tt_aV[BGIMG].length)
        e.backgroundImage = "url(" + tt_aV[BGIMG] + ")";
    e.padding = r + "px";
    e.textAlign = tt_aV[TEXTALIGN];
    if (tt_aV[HEIGHT]) {
        e.overflow = "auto";
        if (tt_aV[HEIGHT] > 0)
            e.height = tt_aV[HEIGHT] + a + "px";
        else
            tt_h = a - tt_aV[HEIGHT]
    }
    e = tt_aElt[6].style;
    e.color = tt_aV[FONTCOLOR];
    e.fontFamily = tt_aV[FONTFACE];
    e.fontSize = tt_aV[FONTSIZE];
    e.fontWeight = tt_aV[FONTWEIGHT];
    e.textAlign = tt_aV[TEXTALIGN];
    if (tt_aV[WIDTH] > 0)
        t = tt_aV[WIDTH];
    else if (tt_aV[WIDTH] == -1 && tt_w)
        t = tt_w;
    else {
        t = tt_GetDivW(tt_aElt[6]);
        if (tt_aV[WIDTH] < -1 && t > -tt_aV[WIDTH])
            t = -tt_aV[WIDTH]
    }
    if (t > tt_w)
        tt_w = t;
    tt_w += a;
    if (tt_aV[SHADOW]) {
        tt_w += tt_aV[SHADOWWIDTH];
        u = Math.floor(tt_aV[SHADOWWIDTH] * 4 / 3);
        e = tt_aElt[7].style;
        e.top = o + "px";
        e.left = u + "px";
        e.width = tt_w - u - tt_aV[SHADOWWIDTH] + "px";
        e.height = tt_aV[SHADOWWIDTH] + "px";
        e.background = tt_aV[SHADOWCOLOR];
        e = tt_aElt[8].style;
        e.top = u + "px";
        e.left = tt_w - tt_aV[SHADOWWIDTH] + "px";
        e.width = tt_aV[SHADOWWIDTH] + "px";
        e.background = tt_aV[SHADOWCOLOR]
    } else
        u = 0;
    tt_SetTipOpa(tt_aV[FADEIN] ? 0 : tt_aV[OPACITY]);
    tt_FixSize(o, u)
}
function tt_FixSize(e, t) {
    var n, r, i, s, o = tt_aV[PADDING], u = tt_aV[BORDERWIDTH], a;
    tt_aElt[0].style.width = tt_w + "px";
    tt_aElt[0].style.pixelWidth = tt_w;
    r = tt_w - (tt_aV[SHADOW] ? tt_aV[SHADOWWIDTH] : 0);
    n = r;
    if (!tt_bBoxOld)
        n -= o + u << 1;
    tt_aElt[5].style.width = n + "px";
    if (tt_aElt[1]) {
        n = r - (tt_aV[TITLEPADDING] + 2 << 1);
        if (!tt_bBoxOld)
            r = n;
        tt_aElt[1].style.width = r + "px";
        tt_aElt[2].style.width = n + "px"
    }
    if (tt_h) {
        i = tt_GetDivH(tt_aElt[5]);
        if (i > tt_h) {
            if (!tt_bBoxOld)
                tt_h -= o + u << 1;
            tt_aElt[5].style.height = tt_h + "px"
        }
    }
    tt_h = tt_GetDivH(tt_aElt[0]) + e;
    if (tt_aElt[8])
        tt_aElt[8].style.height = tt_h - t + "px";
    a = tt_aElt.length - 1;
    if (tt_aElt[a]) {
        tt_aElt[a].style.width = tt_w + "px";
        tt_aElt[a].style.height = tt_h + "px"
    }
}
function tt_DeAlt(e) {
    var t;
    if (e) {
        if (e.alt)
            e.alt = "";
        if (e.title)
            e.title = "";
        t = e.childNodes || e.children || null;
        if (t) {
            for (var n = t.length; n; )
                tt_DeAlt(t[--n])
        }
    }
}
function tt_OpDeHref(e) {
    if (!tt_op)
        return;
    if (tt_elDeHref)
        tt_OpReHref();
    while (e) {
        if (e.hasAttribute && e.hasAttribute("href")) {
            e.t_href = e.getAttribute("href");
            e.t_stats = window.status;
            e.removeAttribute("href");
            e.style.cursor = "hand";
            tt_AddEvtFnc(e, "mousedown", tt_OpReHref);
            window.status = e.t_href;
            tt_elDeHref = e;
            break
        }
        e = tt_GetDad(e)
    }
}
function tt_OpReHref() {
    if (tt_elDeHref) {
        tt_elDeHref.setAttribute("href", tt_elDeHref.t_href);
        tt_RemEvtFnc(tt_elDeHref, "mousedown", tt_OpReHref);
        window.status = tt_elDeHref.t_stats;
        tt_elDeHref = null
    }
}
function tt_El2Tip() {
    var e = tt_t2t.style;
    tt_t2t.t_cp = e.position;
    tt_t2t.t_cl = e.left;
    tt_t2t.t_ct = e.top;
    tt_t2t.t_cd = e.display;
    tt_t2tDad = tt_GetDad(tt_t2t);
    tt_MovDomNode(tt_t2t, tt_t2tDad, tt_aElt[6]);
    e.display = "block";
    e.position = "static";
    e.left = e.top = e.marginLeft = e.marginTop = "0px"
}
function tt_UnEl2Tip() {
    var e = tt_t2t.style;
    e.display = tt_t2t.t_cd;
    tt_MovDomNode(tt_t2t, tt_GetDad(tt_t2t), tt_t2tDad);
    e.position = tt_t2t.t_cp;
    e.left = tt_t2t.t_cl;
    e.top = tt_t2t.t_ct;
    tt_t2tDad = null
}
function tt_OverInit() {
    if (window.event)
        tt_over = window.event.target || window.event.srcElement;
    else
        tt_over = tt_ovr_;
    tt_DeAlt(tt_over);
    tt_OpDeHref(tt_over)
}
function tt_ShowInit() {
    tt_tShow.Timer("tt_Show()", tt_aV[DELAY], true);
    if (tt_aV[CLICKCLOSE] || tt_aV[CLICKSTICKY])
        tt_AddEvtFnc(document, "mouseup", tt_OnLClick)
}
function tt_Show() {
    var e = tt_aElt[0].style;
    e.zIndex = Math.max(window.dd && dd.z ? dd.z + 2 : 0, 1010);
    if (tt_aV[STICKY] || !tt_aV[FOLLOWMOUSE])
        tt_iState &= ~4;
    if (tt_aV[EXCLUSIVE])
        tt_iState |= 8;
    if (tt_aV[DURATION] > 0)
        tt_tDurt.Timer("tt_HideInit()", tt_aV[DURATION], true);
    tt_ExtCallFncs(0, "Show");
    e.visibility = "visible";
    tt_iState |= 2;
    if (tt_aV[FADEIN])
        tt_Fade(0, 0, tt_aV[OPACITY], Math.round(tt_aV[FADEIN] / tt_aV[FADEINTERVAL]));
    tt_ShowIfrm()
}
function tt_ShowIfrm() {
    if (tt_ie56) {
        var e = tt_aElt[tt_aElt.length - 1];
        if (e) {
            var t = e.style;
            t.zIndex = tt_aElt[0].style.zIndex - 1;
            t.display = "block"
        }
    }
}
function tt_Move(e) {
    if (e)
        tt_ovr_ = e.target || e.srcElement;
    e = e || window.event;
    if (e) {
        tt_musX = tt_GetEvtX(e);
        tt_musY = tt_GetEvtY(e)
    }
    if (tt_iState & 4) {
        if (!tt_op && !tt_ie) {
            if (tt_bWait)
                return;
            tt_bWait = true;
            tt_tWaitMov.Timer("tt_bWait = false;", 1, true)
        }
        if (tt_aV[FIX]) {
            tt_iState &= ~4;
            tt_PosFix()
        } else if (!tt_ExtCallFncs(e, "MoveBefore"))
            tt_SetTipPos(tt_Pos(0), tt_Pos(1));
        tt_ExtCallFncs([tt_musX, tt_musY], "MoveAfter")
    }
}
function tt_Pos(e) {
    var t, n, r, i, s, o, u, a, f;
    if (e) {
        n = tt_aV[JUMPVERT];
        r = ABOVE;
        i = OFFSETY;
        s = tt_h;
        o = tt_maxPosY;
        u = tt_GetScrollY();
        a = tt_musY;
        f = tt_bJmpVert
    } else {
        n = tt_aV[JUMPHORZ];
        r = LEFT;
        i = OFFSETX;
        s = tt_w;
        o = tt_maxPosX;
        u = tt_GetScrollX();
        a = tt_musX;
        f = tt_bJmpHorz
    }
    if (n) {
        if (tt_aV[r] && (!f || tt_CalcPosAlt(e) >= u + 16))
            t = tt_PosAlt(e);
        else if (!tt_aV[r] && f && tt_CalcPosDef(e) > o - 16)
            t = tt_PosAlt(e);
        else
            t = tt_PosDef(e)
    } else {
        t = a;
        if (tt_aV[r])
            t -= s + tt_aV[i] - (tt_aV[SHADOW] ? tt_aV[SHADOWWIDTH] : 0);
        else
            t += tt_aV[i]
    }
    if (t > o)
        t = n ? tt_PosAlt(e) : o;
    if (t < u)
        t = n ? tt_PosDef(e) : u;
    return t
}
function tt_PosDef(e) {
    if (e)
        tt_bJmpVert = tt_aV[ABOVE];
    else
        tt_bJmpHorz = tt_aV[LEFT];
    return tt_CalcPosDef(e)
}
function tt_PosAlt(e) {
    if (e)
        tt_bJmpVert = !tt_aV[ABOVE];
    else
        tt_bJmpHorz = !tt_aV[LEFT];
    return tt_CalcPosAlt(e)
}
function tt_CalcPosDef(e) {
    return e ? tt_musY + tt_aV[OFFSETY] : tt_musX + tt_aV[OFFSETX]
}
function tt_CalcPosAlt(e) {
    var t = e ? OFFSETY : OFFSETX;
    var n = tt_aV[t] - (tt_aV[SHADOW] ? tt_aV[SHADOWWIDTH] : 0);
    if (tt_aV[t] > 0 && n <= 0)
        n = 1;
    return(e ? tt_musY - tt_h : tt_musX - tt_w) - n
}
function tt_PosFix() {
    var e, t;
    if (typeof tt_aV[FIX][0] == "number") {
        e = tt_aV[FIX][0];
        t = tt_aV[FIX][1]
    } else {
        if (typeof tt_aV[FIX][0] == "string")
            el = tt_GetElt(tt_aV[FIX][0]);
        else
            el = tt_aV[FIX][0];
        e = tt_aV[FIX][1];
        t = tt_aV[FIX][2];
        if (!tt_aV[ABOVE] && el)
            t += tt_GetDivH(el);
        for (; el; el = el.offsetParent) {
            e += el.offsetLeft || 0;
            t += el.offsetTop || 0
        }
    }
    if (tt_aV[ABOVE])
        t -= tt_h;
    tt_SetTipPos(e, t)
}
function tt_Fade(e, t, n, r) {
    if (r) {
        t += Math.round((n - t) / r);
        if (n > e ? t >= n : t <= n)
            t = n;
        else
            tt_tFade.Timer("tt_Fade(" + e + "," + t + "," + n + "," + (r - 1) + ")", tt_aV[FADEINTERVAL], true)
    }
    t ? tt_SetTipOpa(t) : tt_Hide()
}
function tt_SetTipOpa(e) {
    tt_SetOpa(tt_aElt[5], e);
    if (tt_aElt[1])
        tt_SetOpa(tt_aElt[1], e);
    if (tt_aV[SHADOW]) {
        e = Math.round(e * .8);
        tt_SetOpa(tt_aElt[7], e);
        tt_SetOpa(tt_aElt[8], e)
    }
}
function tt_OnCloseBtnOver(e) {
    var t = tt_aElt[4].style;
    e <<= 1;
    t.background = tt_aV[CLOSEBTNCOLORS][e];
    t.color = tt_aV[CLOSEBTNCOLORS][e + 1]
}
function tt_OnLClick(e) {
    e = e || window.event;
    if (!(e.button && e.button & 2 || e.which && e.which == 3)) {
        if (tt_aV[CLICKSTICKY] && tt_iState & 4) {
            tt_aV[STICKY] = true;
            tt_iState &= ~4
        } else if (tt_aV[CLICKCLOSE])
            tt_HideInit()
    }
}
function tt_Int(e) {
    var t;
    return isNaN(t = parseInt(e)) ? 0 : t
}
function tt_GetWndCliSiz(e) {
    var t, n = window["inner" + e], r = "client" + e, i = "number";
    if (typeof n == i) {
        var s;
        return(t = document.body) && typeof (s = t[r]) == i && s && s <= n ? s : (t = document.documentElement) && typeof (s = t[r]) == i && s && s <= n ? s : n
    }
    return(t = document.documentElement) && (n = t[r]) ? n : document.body[r]
}
function tt_SetOpa(e, t) {
    var n = e.style;
    tt_opa = t;
    if (tt_flagOpa == 1) {
        if (t < 100) {
            if (typeof e.filtNo == tt_u)
                e.filtNo = n.filter;
            var r = n.visibility != "hidden";
            n.zoom = "100%";
            if (!r)
                n.visibility = "visible";
            n.filter = "alpha(opacity=" + t + ")";
            if (!r)
                n.visibility = "hidden"
        } else if (typeof e.filtNo != tt_u)
            n.filter = e.filtNo
    } else {
        t /= 100;
        switch (tt_flagOpa) {
            case 2:
                n.KhtmlOpacity = t;
                break;
            case 3:
                n.KHTMLOpacity = t;
                break;
            case 4:
                n.MozOpacity = t;
                break;
            case 5:
                n.opacity = t;
                break
            }
    }
}
function tt_Err(e, t) {
    if (tt_Debug || !t)
        alert("Tooltip Script Error Message:\n\n" + e)
}
function tt_ExtCmdEnum() {
    var s;
    for (var i in config) {
        s = "window." + i.toString().toUpperCase();
        if (eval("typeof(" + s + ") == tt_u")) {
            eval(s + " = " + tt_aV.length);
            tt_aV[tt_aV.length] = null
        }
    }
}
function tt_ExtCallFncs(e, t) {
    var n = false;
    for (var r = tt_aExt.length; r; ) {
        --r;
        var i = tt_aExt[r]["On" + t];
        if (i && i(e))
            n = true
    }
    return n
}
var config = new Object;
var tt_Debug = true;
var tt_Enabled = true;
var TagsToTip = true;
config.Above = false;
config.BgColor = "#e8f5d6";
config.BgImg = "";
config.BorderColor = "#cae3a6";
config.BorderStyle = "solid";
config.BorderWidth = 1;
config.CenterMouse = false;
config.ClickClose = false;
config.ClickSticky = false;
config.CloseBtn = false;
config.CloseBtnColors = ["#990000", "#FFFFFF", "#DD3333", "#FFFFFF"];
config.CloseBtnText = " X ";
config.CopyContent = true;
config.Delay = 400;
config.Duration = 0;
config.Exclusive = false;
config.FadeIn = 100;
config.FadeOut = 100;
config.FadeInterval = 30;
config.Fix = null;
config.FollowMouse = true;
config.FontColor = "#333333";
config.FontFace = "Verdana,Geneva,sans-serif";
config.FontSize = "8pt";
config.FontWeight = "normal";
config.Height = 0;
config.JumpHorz = false;
config.JumpVert = true;
config.Left = false;
config.OffsetX = 14;
config.OffsetY = 8;
config.Opacity = 100;
config.Padding = 3;
config.Shadow = false;
config.ShadowColor = "#C0C0C0";
config.ShadowWidth = 5;
config.Sticky = false;
config.TextAlign = "left";
config.Title = "";
config.TitleAlign = "left";
config.TitleBgColor = "";
config.TitleFontColor = "#FFFFFF";
config.TitleFontFace = "";
config.TitleFontSize = "";
config.TitlePadding = 2;
config.Width = 0;
var tt_aElt = new Array(10), tt_aV = new Array, tt_sContent, tt_t2t, tt_t2tDad, tt_musX, tt_musY, tt_over, tt_x, tt_y, tt_w, tt_h;
var tt_aExt = new Array, tt_db, tt_op, tt_ie, tt_ie56, tt_bBoxOld, tt_body, tt_ovr_, tt_flagOpa, tt_maxPosX, tt_maxPosY, tt_iState = 0, tt_opa, tt_bJmpVert, tt_bJmpHorz, tt_elDeHref, tt_tShow = new Number(0), tt_tHide = new Number(0), tt_tDurt = new Number(0), tt_tFade = new Number(0), tt_tWaitMov = new Number(0), tt_bWait = false, tt_u = "undefined";
Number.prototype.Timer = function(e, t, n) {
    if (!this.value || n)
        this.value = window.setTimeout(e, t)
};
Number.prototype.EndTimer = function() {
    if (this.value) {
        window.clearTimeout(this.value);
        this.value = 0
    }
};
tt_Init()