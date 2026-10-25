/* Cores, tema e nome — compartilhado por Metas e Feito */
(function(){
  const APP = /\/feito\//.test(location.pathname) ? "feito" : "metas";
  const PADROES = [["Rosa","#d36d9c"],["Oceano","#3b82c4"],["Floresta","#3f9a6c"]];
  const ls = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };
  const TEMA_K = APP + ".tema";
  let cor = ls.get("cores.cor") || PADROES[0][1], ctx = null;

  function hsl(hex){ let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    const mx = Math.max(r,g,b), mn = Math.min(r,g,b); let h = 0, s = 0, l = (mx+mn)/2;
    if (mx !== mn){ const d = mx-mn; s = l > .5 ? d/(2-mx-mn) : d/(mx+mn); h = mx === r ? (g-b)/d + (g < b ? 6 : 0) : mx === g ? (b-r)/d + 2 : (r-g)/d + 4; h *= 60; }
    return [Math.round(h), Math.round(s*100), Math.round(l*100)]; }
  const H = (h,s,l,a) => a == null ? `hsl(${(h+360)%360} ${s}% ${l}%)` : `hsl(${(h+360)%360} ${s}% ${l}% / ${a})`;
  function vars(hex, dark){
    const [h,s0,l0] = hsl(hex), s = Math.max(35, Math.min(s0, 80)), h2 = h + 60;
    if (APP === "metas") return dark ? {
      "color-scheme":"dark","--bg":H(h,20,10),"--surface":H(h,18,14),"--surface-2":H(h,18,18),"--line":H(h,15,23),"--line-2":H(h,15,30),
      "--text":H(h,30,93),"--muted":H(h,12,68),"--faint":H(h,10,48),"--accent":H(h,s,58),"--accent-2":H(h2,55,70),"--money":H(h,s,72),"--money-soft":H(h,28,22),
      "--mid":H(h,s,58),"--mid-soft":H(h,28,22),"--ok-soft":H(150,25,18),"--long-soft":H(260,25,22),"--warn-soft":H(40,30,18),"--shadow":"0 1px 0 rgba(0,0,0,.4)"
    } : {
      "color-scheme":"light","--bg":H(h,55,97),"--surface":"#ffffff","--surface-2":H(h,70,96),"--line":H(h,45,91),"--line-2":H(h,40,84),
      "--text":H(h,20,26),"--muted":H(h,12,55),"--faint":H(h,15,72),"--accent":hex,"--accent-2":H(h2,65,72),"--money":H(h,s,Math.max(l0-8,28)),"--money-soft":H(h,75,94),
      "--mid":hex,"--mid-soft":H(h,75,94),"--shadow":`0 4px 16px ${H(h,30,40,.10)}`
    };
    return dark ? {
      "--bg":H(h,20,10),"--side":H(h,18,12),"--surface":H(h,18,14),"--sunk":H(h,18,18),"--ink":H(h,30,93),"--muted":H(h,12,68),"--line":H(h,15,22),
      "--accent":H(h,s,68),"--accent-ink":H(h,50,12),"--accent-soft":H(h,30,22),"--accent-text":H(h,70,80),"--title":H(h,30,93),"--hl":H(h,30,22),"--hl-ink":H(h,70,80),
      "--baixa":H(h,10,40),"--grad":`linear-gradient(90deg,${H(h,40,35)},${H(h2,35,40)})`,"--now":H(h,s,68),"--dh-bg":H(h,18,18),"--dh-ink":H(h,30,93),
      "--time-ink":H(h,10,60),"--col-bg":H(h,18,12),"--col-today":H(h,22,15),"--col-line":H(h,15,18),"--trab-bg":H(h,18,18),"--trab-ink":H(h,30,93)
    } : {
      "--bg":H(h,55,97),"--side":H(h,50,95),"--surface":"#ffffff","--sunk":H(h,70,97),"--ink":H(h,20,26),"--muted":H(h,12,55),"--line":H(h,45,91),
      "--accent":hex,"--accent-ink":"#ffffff","--accent-soft":H(h,75,94),"--accent-text":H(h,s,Math.max(l0-12,25)),"--title":H(h,20,26),"--hl":H(h,75,94),"--hl-ink":H(h,s,Math.max(l0-12,25)),
      "--baixa":H(h,20,74),"--shadow":`0 4px 16px ${H(h,30,40,.10)}`,"--panel-shadow":`0 4px 16px ${H(h,30,40,.08)}`,"--grad":`linear-gradient(90deg,${H(h,75,90)},${H(h2,70,91)})`,
      "--now":hex,"--dh-bg":H(h,70,97),"--dh-ink":H(h,20,26),"--time-ink":H(h,12,55),"--col-bg":H(h,60,99),"--col-today":H(h,70,96),"--col-line":H(h,40,93),"--trab-bg":H(h,70,97),"--trab-ink":H(h,20,26)
    };
  }
  const bloco = o => Object.entries(o).map(([k,v]) => `${k}:${v}`).join(";");
  function aplicar(){
    const L = bloco(vars(cor,false)), D = bloco(vars(cor,true));
    let css = `:root{${L}}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${D}}}:root[data-theme="dark"]{${D}}`;
    if (APP === "metas"){
      const [h] = hsl(cor), h2 = h + 60;
      const regras = dark => [
        [".hero", `background:${dark ? `linear-gradient(135deg,${H(h,30,19)},${H(h2,25,21)})` : `linear-gradient(135deg,${H(h,75,90)} 0%,${H(h+30,60,92)} 55%,${H(h2,70,93)} 100%)`}`],
        [".hero .lbl", `color:${dark ? H(h,15,72) : H(h,25,47)}`],
        [".pool", `background:${dark ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.6)"}`],
        [".hero .bar", `background:${dark ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.55)"}`],
        ['.tabs button[aria-selected="true"]', "background:var(--text);color:var(--bg)"],
        ['.tabs button[aria-selected="true"] .cnt', "color:var(--bg);background:rgba(127,127,127,.25)"],
        [".tabs .cnt", `background:${H(h,40,50,.14)}`],
        [".fab", `box-shadow:0 10px 26px ${H(h,50,50,.35)}`],
      ];
      const pre = (sel, r) => r.map(([a,b]) => a.split(",").map(x => sel + x).join(",") + `{${b}}`).join("");
      css += pre(":root ", regras(false)) + `@media (prefers-color-scheme:dark){${pre(':root:not([data-theme="light"]) ', regras(true))}}` + pre(':root[data-theme="dark"] ', regras(true));
    }
    css += `#cores-ov{position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:16px}
#cores-ov[hidden]{display:none!important}
.cr-card{background:var(--surface);color:var(--text,var(--ink));border-radius:24px;padding:22px;max-width:380px;width:100%;display:grid;gap:12px;font-family:Nunito,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.2)}
.cr-card h2{margin:0;font-size:1.2rem}.cr-card p{margin:0;color:var(--muted)}
.cr-row{display:flex;gap:8px;flex-wrap:wrap}
.cr-op{border:2px solid var(--line);background:var(--surface);color:inherit;border-radius:14px;padding:8px 12px;font:inherit;font-weight:800;display:flex;align-items:center;gap:8px}
.cr-op[aria-pressed="true"]{border-color:var(--accent)}
.cr-dot{width:18px;height:18px;border-radius:50%;display:inline-block}
.cr-card input[type=color]{width:46px;height:36px;border:0;background:none;padding:0}
.cr-card input[type=text]{border:1.5px solid var(--line);background:var(--bg);color:inherit;border-radius:14px;padding:11px 12px;font:inherit}
.cr-btn{border:0;background:var(--accent);color:#fff;border-radius:99px;padding:12px;font:inherit;font-weight:800}
.nome-user::after{content:var(--nome,"")}
.cr-lbl{font-size:.8rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}`;
    let st = document.getElementById("cores-css"); if (!st){ st = document.createElement("style"); st.id = "cores-css"; }
    st.textContent = css; (document.head || document.documentElement).appendChild(st);
    if (APP === "metas"){ const t = ls.get(TEMA_K) || "auto", r = document.documentElement;
      if (t === "claro") r.setAttribute("data-theme","light"); else if (t === "escuro") r.setAttribute("data-theme","dark"); else r.removeAttribute("data-theme");
      if (window.__pintaTema) window.__pintaTema(); }
  }
  function nomeVisivel(n){ window.__nome = n || ""; document.documentElement.style.setProperty("--nome", JSON.stringify(n || ""));
    if (APP === "metas") document.title = n ? "Metas de " + n : "Metas"; }
  function overlay(html){ let el = document.getElementById("cores-ov"); if (!el){ el = document.createElement("div"); el.id = "cores-ov"; document.body.appendChild(el); }
    el.innerHTML = `<div class="cr-card">${html}</div>`; el.hidden = false; return el; }
  async function salvarMeta(dados){ if (!ctx) return; try { const { data } = await ctx.sb.auth.updateUser({ data: dados }); if (data && data.user) ctx.user = data.user; } catch(e){} }
  function pedirNome(){ return new Promise(res => {
    const el = overlay(`<h2>Como você quer ser chamado?</h2><p>Aparece no topo dos apps.</p><input type="text" id="cr-nome" maxlength="30" placeholder="Seu nome"><button class="cr-btn" id="cr-ok">Salvar</button>`);
    const i = el.querySelector("#cr-nome"); setTimeout(() => i.focus(), 50);
    const ok = async () => { const n = i.value.trim(); if (!n){ i.focus(); return; } el.hidden = true; nomeVisivel(n); await salvarMeta({ nome: n }); res(); };
    el.querySelector("#cr-ok").onclick = ok; i.onkeydown = e => { if (e.key === "Enter") ok(); }; }); }
  async function iniciar(sb, user){
    ctx = { sb, user }; const m = user.user_metadata || {};
    if (m.cor && /^#[0-9a-f]{6}$/i.test(m.cor) && m.cor !== cor){ cor = m.cor; ls.set("cores.cor", cor); }
    if (APP === "metas" && m.tema_metas && m.tema_metas !== ls.get(TEMA_K)) ls.set(TEMA_K, m.tema_metas);
    aplicar();
    if (m.nome) nomeVisivel(m.nome); else await pedirNome();
  }
  function abrir(){
    const tema = ls.get(TEMA_K) || "auto", padrao = PADROES.find(p => p[1].toLowerCase() === cor.toLowerCase());
    const el = overlay(`<h2>Cores</h2>
      <span class="cr-lbl">Paleta</span><div class="cr-row">${PADROES.map(([n,c]) => `<button class="cr-op" data-cor="${c}" aria-pressed="${padrao && padrao[1] === c}"><span class="cr-dot" style="background:${c}"></span>${n}</button>`).join("")}</div>
      <span class="cr-lbl">Ou escolha a cor principal</span><div class="cr-row" style="align-items:center"><input type="color" id="cr-cor" value="${cor}"><span class="muted" id="cr-hex">${cor}</span></div>
      ${APP === "metas" ? `<span class="cr-lbl">Modo</span><div class="cr-row">${[["auto","Automático"],["claro","Claro"],["escuro","Escuro"]].map(([k,n]) => `<button class="cr-op" data-tema="${k}" aria-pressed="${tema === k}">${n}</button>`).join("")}</div>` : `<p>O modo claro/escuro fica no botão Tema do menu.</p>`}
      <span class="cr-lbl">Nome</span><input type="text" id="cr-nome" maxlength="30" value="${(window.__nome || "").replace(/"/g,"&quot;")}">
      <button class="cr-btn" id="cr-ok">Pronto</button>`);
    const marca = () => el.querySelectorAll("[data-cor]").forEach(b => b.setAttribute("aria-pressed", b.dataset.cor.toLowerCase() === cor.toLowerCase()));
    const troca = c => { cor = c; ls.set("cores.cor", c); el.querySelector("#cr-cor").value = c; el.querySelector("#cr-hex").textContent = c; aplicar(); marca(); };
    el.querySelectorAll("[data-cor]").forEach(b => b.onclick = () => troca(b.dataset.cor));
    el.querySelector("#cr-cor").oninput = e => troca(e.target.value);
    el.querySelectorAll("[data-tema]").forEach(b => b.onclick = () => { ls.set(TEMA_K, b.dataset.tema); aplicar(); el.querySelectorAll("[data-tema]").forEach(x => x.setAttribute("aria-pressed", x === b)); });
    el.querySelector("#cr-ok").onclick = async () => { const n = el.querySelector("#cr-nome").value.trim(); el.hidden = true; if (n) nomeVisivel(n);
      const d = { cor }; if (n) d.nome = n; if (APP === "metas") d.tema_metas = ls.get(TEMA_K) || "auto"; await salvarMeta(d); };
    el.onclick = e => { if (e.target === el) el.querySelector("#cr-ok").click(); };
  }
  const SOL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>';
  const LUA = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/></svg>';
  const escuroAgora = () => { const r = document.documentElement.getAttribute("data-theme"); return r ? r === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
  function botaoTema(){
    if (APP !== "metas" || document.getElementById("cr-tema")) return;
    const alvo = document.querySelector(".top .filters"); if (!alvo) return;
    const b = document.createElement("button"); b.className = "btn sm"; b.id = "cr-tema"; b.type = "button";
    b.style.cssText = "display:inline-flex;align-items:center;justify-content:center;padding-inline:10px";
    const pinta = () => { const d = escuroAgora(); b.innerHTML = d ? SOL : LUA; b.title = b.ariaLabel = d ? "Mudar para modo claro" : "Mudar para modo escuro"; };
    b.onclick = () => { const t = escuroAgora() ? "claro" : "escuro"; ls.set(TEMA_K, t); aplicar(); pinta(); salvarMeta({ tema_metas: t }); };
    alvo.prepend(b); pinta();
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", pinta);
    window.__pintaTema = pinta;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", botaoTema); else botaoTema();
  aplicar();
  window.Cores = { iniciar, abrir };
})();
