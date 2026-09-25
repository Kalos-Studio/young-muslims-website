import Script from "next/script";

const INSTALLATION_SCRIPT = `(function(w,d,s,n,a){if(!w[n]){var l='call,catch,on,once,set,then,track,openCheckout'.split(','),i,o=function(n){return'function'==typeof n?o.l.push([arguments])&&o:function(){return o.l.push([n,arguments])&&o}},t=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=!0;j.src='https://cdn.fundraiseup.com/widget/'+a+'';t.parentNode.insertBefore(j,t);o.s=Date.now();o.v=5;o.h=w.location.href;o.l=[];for(i=0;i<8;i++)o[l[i]]=o(l[i]);w[n]=o}})(window,document,'script','FundraiseUp','ANFPRBST');`;

const FORM_ONLY_SCRIPT = `(function(d){var ids=['XPEJMZJG','XVPPDXEZ'];function removeGlobalElements(root){if(root.nodeType!==1)return;if(ids.indexOf(root.id)!==-1){root.remove();return}for(var i=0;i<ids.length;i++){var element=root.querySelector('#'+ids[i]);if(element)element.remove()}}new MutationObserver(function(mutations){for(var i=0;i<mutations.length;i++){for(var j=0;j<mutations[i].addedNodes.length;j++)removeGlobalElements(mutations[i].addedNodes[j])}}).observe(d.documentElement,{childList:true,subtree:true})})(document);`;

/**
 * Fundraise Up's account-level loader. The dashboard-provided bootstrap runs
 * once for the whole site and loads the checkout modal and embedded Elements.
 * Account-wide popup and sticky button Elements are removed so only the form
 * placed on the Support page is shown.
 * Local development and Netlify previews use Test mode so they cannot process
 * live donations.
 */
export function FundraiseUpScript() {
  const useTestMode =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_FUNDRAISE_UP_LIVEMODE === "false";

  return (
    // App Router guidance requires beforeInteractive scripts in the root layout;
    // this component is rendered only from src/app/layout.tsx.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="fundraise-up" strategy="beforeInteractive">
      {`${useTestMode ? "window.fundraiseup_livemode=false;" : ""}${FORM_ONLY_SCRIPT}${INSTALLATION_SCRIPT}`}
    </Script>
  );
}
