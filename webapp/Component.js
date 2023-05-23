jQuery.sap.declare("ui.ssuite.s2p.mm.pur.pr.prcss.s1.MM_PR_PRCS1Extension.Component");

// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "ui.ssuite.s2p.mm.pur.pr.prcss.s1",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/MM_PR_PRCS1"
		// we use a URL relative to our own component
		// extension application is deployed with customer namespace
});

this.ui.ssuite.s2p.mm.pur.pr.prcss.s1.Component.extend("ui.ssuite.s2p.mm.pur.pr.prcss.s1.MM_PR_PRCS1Extension.Component", {
	metadata: {
		manifest: "json"
	}
});