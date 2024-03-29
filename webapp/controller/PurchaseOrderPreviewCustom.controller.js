sap.ui.define([
	"ui/ssuite/s2p/mm/pur/pr/prcss/s1/controller/BaseController",
	"sap/ui/core/routing/History",
	"ui/ssuite/s2p/mm/pur/pr/prcss/s1/model/formatter",
	"ui/ssuite/s2p/mm/pur/pr/prcss/s1/controller/ServiceManager",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem"
], function (B, H, f, S, F, a, M, c) {
	"use strict";
	var m = new sap.m.MessagePopoverItem({
		type: "{state}",
		title: "{name}",
		counter: "{aMessages.length}"
	});
	var n;
	var o = new sap.m.MessagePopover({
		items: {
			path: "/",
			template: m
		}
	});
	return sap.ui.controller("ui.ssuite.s2p.mm.pur.pr.prcss.s1.MM_PR_PRCS1Extension1.controller.PurchaseOrderPreviewCustom", {
		    formatter: f,
		    ServiceManager: S,
		    onInit: function () {
		        this.getRouter().getRoute("PurchaseOrderPreview").attachPatternMatched(jQuery.proxy(function (e) {
		            var N = e.getParameter("name");
		            this.oApplicationModel = this.getModel();
		            if (N === "PurchaseOrderPreview") {
		                var r = sap.ui.core.UIComponent.getRouterFor(this);
		                this.oRouter = r;
		                this.is_initial_load = true;
		                this.refreshPODrafts();
		                if (this.is_initial_load === true)
		                    this.byId("idTabContainer").getBinding("items").refresh();
		            }
		        }, this), this);
		        if (!jQuery.support.touch) {
		            this.getView().addStyleClass("sapUiSizeCompact");
		        }
		    },
		    onAfterRendering: function () {
		        this.byId("PurchaseOrdersPreview").setShowHeader(false);
		    },
		    refreshPODrafts: function () {
		        var b = this.oApplicationModel;
		        var p = {
		            urlParameters: { "$expand": "to_PurOrderItmDrftForMngPurReqn" },
		            success: jQuery.proxy(this.successPODraft, this),
		            error: jQuery.proxy(this.error, this)
		        };
		        b.read("/C_PurOrderDraftForMngPurReqn", p);
		    },
		    successPODraft: function (d, r) {
		        var p = d;
		        n = p.results.length;
		        if (!this.oldData) {
		            this.oldData = d;
		        }
		        if (p.results.length === 0) {
		            this.onNavBack();
		        } else if (this.oldData.results.length !== d.results.length) {
		            this.oldData = d;
		            if (this.is_initial_load === false) {
		                this.byId("idTabContainer").getBinding("items").refresh();
		            }
		        }
		        this.is_initial_load = false;
		    },
		    error: function (e) {
		    },
		    comboFill: function (C) {
		        C.getSource().getBinding("items").resume();
		    },
		    handleBusinessCard: function (e) {
		        this.idSourceVendorFgt = e.getSource().getId();
		        var v = e.getSource().getBindingContext().getObject().FixedSupplier;
		        if (v === "" || v === undefined) {
		            v = e.getSource().getBindingContext().getObject().Supplier;
		        }
		        var b = this.getModel();
		        var u = "/VendorSet(Supplier='" + v + "')";
		        if (this._oPopover) {
		            this._oPopover.destroy();
		        }
		        this._oPopover = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.fragment.BusinessCard", this);
		        this.getView().addDependent(this._oPopover);
		        var p = { success: jQuery.proxy(this.BusinessCardData, this) };
		        this.oApplicationModel.read(u, p);
		        var d = e.getSource();
		        jQuery.sap.delayedCall(0, this, function () {
		            this._oPopover.openBy(d);
		        });
		    },
		    BusinessCardData: function (d, r) {
		        this._oPopover.setModel(new sap.ui.model.json.JSONModel(d));
		        this._oPopover.setContentHeight("auto");
		    },
		    onCallAfterClose: function (e) {
		        this._oPopover.destroy();
		    },
		    onExit: function () {
		        if (this._oPopover) {
		            this._oPopover.destroy();
		        }
		    },
		    fnPopOverDiscard: function (e) {
		        var p;
		        this.vPOPurchaseOrderDraftUUID = e.getSource().getBindingContext().getProperty("PurchaseOrderDraftUUID");
		        if (this.getTestMode() === true) {
		            p = 1;
		        } else {
		            p = parseInt(e.getSource().getParent().getId().charAt(e.getSource().getParent().getId().length - 1)) + 1;
		        }
		        if (this._oPopover) {
		            this._oPopover.destroy();
		        }
		        this._oPopover = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.fragment.discardPO", this);
		        this.getView().addDependent(this._oPopover);
		        var b = e.getSource();
		        jQuery.sap.delayedCall(0, this, function () {
		            this._oPopover.openBy(b);
		        });
		        var d = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DiscardDraftmsg");
		        sap.ui.getCore().byId("discardtext").setText(d + p + "?");
		    },
		    handlePODiscardPress: function (e) {
		        var p = this.vPOPurchaseOrderDraftUUID.trim();
		        var d = "/C_PurOrderDraftForMngPurReqn(PurchaseOrderDraftUUID=guid'" + p + "')";
		        var b = this.oApplicationModel;
		        b.setRefreshAfterChange(false);
		        var P = {};
		        P.success = jQuery.proxy(this.successDraftDelete, this);
		        P.error = jQuery.proxy(this.fnErrorPOHeaderDiscard, this);
		        b.remove(d, P);
		        if (this.getTestMode() === true) {
		            window.history.go(-1);
		            return;
		        }
		    },
		    fnErrorPOHeaderDiscard: function (d, r) {
		        this._oPopover.close();
		        var b = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DiscardDiscardFailure");
		        sap.m.MessageToast.show(b, { duration: 3000 });
		    },
		    tabitemCloseHandler: function (e) {
		        e.preventDefault();
		        var b = e.getParameter("item").getBindingContext();
		        var t = this.getView().byId("idTabContainer");
		        var i = e.getParameter("item");
		        var p = e.getSource().getModel().getProperty("PurchaseOrderDraftUUID", b);
		        var d = this;
		        var g = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TabItemClose");
		        sap.m.MessageBox.confirm(g + " " + i.getName() + "?", {
		            onClose: function (A) {
		                if (A === sap.m.MessageBox.Action.OK) {
		                    d.byId("idTabContainer").getBinding("items").refresh();
		                    var h = "/C_PurOrderItmDrftForMngPurReqn(PurchaseOrderDraftUUID=guid'" + p + "',PurchaseOrderItem='')";
		                    var j = d.oApplicationModel;
		                    j.setRefreshAfterChange(false);
		                    var P = {};
		                    P.success = jQuery.proxy(d.successDraftDelete, d);
		                    P.error = jQuery.proxy(d.fnErrorPOHeaderDiscard, d);
		                    j.remove(h, P);
		                    t.removeItem(i);
		                }
		            }
		        });
		    },
		    fnCreatePurchaseOrder: function (e) {
		        var i = this.byId("idTabContainer").getSelectedItem();
		        var C = i.replace("idTabContainerItem", "idCBPOTypes");
		        var b = this.byId(C);
		        if (b.getValue("value") === "") {
		            b.setValueState(sap.ui.core.ValueState.Error);
		            b.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errPOType"));
		            this.bSelectPOType = true;
		            this.onTypeUpdateSuccess();
		        } else {
		            var p = e.getSource().getBindingContext().getProperty("PurchaseOrderDraftUUID");
		            var d = this.oApplicationModel;
		            var P = { "PurchaseOrderDraftUUID": p };
		            var g = "PO";
		            var h = this;
		            if (this.getTestMode() === undefined || this.getTestMode() === false) {
		                S.activateBO(p, g, P, h);
		            } else {
		                this.activateBoSuccess();
		            }
		        }
		        this.getView().rerender();
		        var s = i.replace("idTabContainerItem", "idBMsgPopover");
		        var j = this.byId(s);
		        j.firePress();
		    },
		    onTypeUpdateSuccess: function (d, r) {
		        var i = this.byId("idTabContainer").getSelectedItem();
		        var s = i.replace("idTabContainerItem", "idBMsgPopover");
		        var b = this.byId(s);
		        var e = new Array();
		        if (this.bSelectPOType) {
		            var C = {
		                icon: "sap-icon://error",
		                name: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errPOType"),
		                state: "Error"
		            };
		            e.push(C);
		            b.setVisible(true);
		            this.oMessagePopover = this._getMessagePopover(e);
		        } else if (r !== undefined) {
		            if (r.headers["sap-message"] !== undefined && JSON.parse(r.headers["sap-message"]).code === "APPL_MM_PR/017") {
		                var C = {
		                    icon: "sap-icon://error",
		                    name: JSON.parse(r.headers["sap-message"]).message,
		                    state: "Error"
		                };
		                e.push(C);
		                b.setVisible(true);
		                this.oMessagePopover = this._getMessagePopover(e);
		            }
		        }
		    },
		    onPOTypeChange: function (e) {
		        var N = true;
		        for (var C = 0; C < e.getSource().getList().getItems().length; C++) {
		            if (e.getSource().getList().getItems()[C].getTitle() == e.getSource().getSelectedItem().getText()) {
		                N = false;
		                break;
		            }
		        }
		        if (N == true) {
		            e.getSource().setValue("");
		        }
		        var b = e.getSource();
		        if (b.getValue("value") !== "") {
		            this.bSelectPOType = false;
		            b.setValueState(sap.ui.core.ValueState.None);
		            var i = this.byId("idTabContainer").getSelectedItem();
		            var s = i.replace("idTabContainerItem", "idBMsgPopover");
		            var d = this.byId(s);
		            d.setVisible(false);
		        }
		        var g = e.getSource().getProperty("selectedKey", e.getSource().getBindingContext());
		        var p = e.getSource().getBindingContext().getProperty("PurchaseOrderDraftUUID");
		        var P = {
		            "PurchaseOrderDraftUUID": p,
		            "PurchaseOrderType": g
		        };
		        var h = this.oApplicationModel;
		        h.setRefreshAfterChange(false);
		        var j = "/C_PurOrderDraftForMngPurReqn(guid'" + p + "')";
		        var k = new Object();
		        k.success = jQuery.proxy(this.onTypeUpdateSuccess, this);
		        k.error = jQuery.proxy(this.onErrorUpdate, this);
		        h.update(j, P, k);
		    },
		    handleItemDelete: function (e) {
		        var b = e.getParameter("listItem").getBindingContext();
		        var p = e.getSource().getModel().getProperty("PurchaseOrderDraftUUID", b);
		        p = p.trim();
		        var i = e.getSource().getModel().getProperty("PurchaseOrderItem", b);
		        var d = "/C_PurOrderItmDrftForMngPurReqn(PurchaseOrderDraftUUID=guid'" + p + "',PurchaseOrderItem='" + i + "')";
		        var g = this.oApplicationModel;
		        g.remove(d, {
		            success: jQuery.proxy(this.successDraftDelete, this),
		            error: jQuery.proxy(this.errorCreateDraft, this)
		        });
		        g.setRefreshAfterChange(false);
		    },
		    successDraftDelete: function () {
		        if (this._oPopover && this._oPopover.popup) {
		            this._oPopover.close();
		            var b = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DiscardDiscardSuccess");
		            sap.m.MessageToast.show(b);
		        }
		        this.refreshPODrafts();
		    },
		    successTabClose: function () {
		        if (n <= 0) {
		            var p = H.getInstance().getPreviousHash(), C = sap.ushell.Container.getService("CrossApplicationNavigation");
		            if (p !== undefined || !C.isInitialNavigation()) {
		                history.go(-1);
		            } else {
		                var C = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
		                C.toExternal({
		                    target: {
		                        semanticObject: "PurchaseRequisition",
		                        action: "manage"
		                    }
		                });
		            }
		        }
		    },
		    onNavBack: function (e) {
		        this.oRouter.navTo("worklist", {}, true);
		    },
		    _getMessageState: function (s) {
		        switch (s) {
		        case "error":
		            return sap.ui.core.ValueState.Error;
		            break;
		        case "warning":
		            return sap.ui.core.ValueState.Warning;
		            break;
		        case "success":
		            return sap.ui.core.ValueState.Success;
		            break;
		        case "info":
		            return sap.ui.core.ValueState.Success;
		            break;
		        }
		    },
		    _getMessageIcon: function (s) {
		        switch (s) {
		        case "error":
		            return "sap-icon://error";
		            break;
		        case "warning":
		            return "sap-icon://notification";
		            break;
		        case "success":
		            return "sap-icon://sys-enter";
		            break;
		        case "info":
		            return "sap-icon://sys-enter";
		            break;
		        }
		    },
		    activateBoSuccess: function (d, r) {
		        if (this.getTestMode() == true) {
		            var s = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("CREATE_PO_SUCCESS");
		            var C = new Array();
		            var b = {
		                name: s,
		                state: "Success"
		            };
		            C.push(b);
		            var e = this._getMessagePopup(C);
		            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), e);
		            e.setTitle("Purchase Order Number");
		            e.open();
		            return;
		        }
		        var i = 0;
		        var g = false;
		        var h = JSON.parse(r.headers["sap-message"]).details;
		        var C = new Array();
		        if (!h.length || (JSON.parse(r.headers["sap-message"]).code === "06/017" || JSON.parse(r.headers["sap-message"]).code === "MEPO/013")) {
		            if (JSON.parse(r.headers["sap-message"]).severity !== "error") {
		                g = true;
		            }
		        }
		        s = JSON.parse(r.headers["sap-message"]).message;
		        var b = {
		            name: s,
		            state: this._getMessageState(JSON.parse(r.headers["sap-message"]).severity),
		            icon: this._getMessageIcon(JSON.parse(r.headers["sap-message"]).severity)
		        };
		        C.push(b);
		        for (i = 0; i < h.length; i++) {
		            var s;
		            if (h[i].code === "06/017" || h[i].code === "MEPO/013") {
		                s = h[i].message;
		                g = true;
		            } else {
		                s = h[i].message;
		            }
		            var b = {
		                name: s,
		                state: this._getMessageState(h[i].severity),
		                icon: this._getMessageIcon(h[i].severity)
		            };
		            C.push(b);
		        }
		        if (g == true) {
		            var e = this._getMessagePopup(C);
		            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), e);
		            e.open();
		        } else {
		            var I = this.byId("idTabContainer").getSelectedItem();
		            var j = I.replace("idTabContainerItem", "idBMsgPopover");
		            var k = this.byId(j);
		            k.setVisible(true);
		            this.oMessagePopover = this._getMessagePopover(C);
		        }
		    },
		    errorCreateFOD: function (e) {
		    },
		    handleMessagePopoverPress: function (e) {
		        if (this.getTestMode() === false) {
		            this.oMessagePopover.openBy(e.getSource());
		        }
		    },
		    _getMessagePopover: function (b) {
		        var d = new sap.ui.model.json.JSONModel();
		        d.setData(b);
		        var v = new sap.ui.model.json.JSONModel();
		        v.setData({ "results.messagesLength": b.length + "" });
		        this.byId("idBMsgPopover").setModel(v);
		        return o.setModel(d);
		    },
		    _getMessagePopup: function (d) {
		        var t = this;
		        var b = d[0].name;
		        var g = b.match(/(\d{10})/)[0];
		        var h = b.split(b.match(/(\d{10})/)[0]);
		        var r = new sap.m.Text({ text: h[0].toString() }), i = new sap.m.Text({ text: h[1].toString() }), l = new sap.m.Link({
		                text: g.toString(),
		                press: function (e) {
		                    var P = this.getText();
		                    var C = sap.ushell.Container.getService("CrossApplicationNavigation");

							 if (n <= 1) {
		                        C.toExternal({
		                            target: {
		                                semanticObject: "ZPurchaseOrde",
		                                action: "display"
		                            },
		                            params: {
		                                PurchaseOrder: [P]
		                            }
		                        });
		                    }else {
								    C.toExternal({
								        target: {
								            semanticObject: "ZPurchaseOrde",
								            action: "display"
								        },
								        params: {
								            PurchaseOrder: [P],
											"sap-ushell-navmode": "explace"
								           
								        }
								    });
								}

		                    // if (n <= 1) {
		                    //     C.toExternal({
		                    //         target: {
		                    //             semanticObject: "PurchaseOrder",
		                    //             action: "manage"
		                    //         },
		                    //         params: {
		                    //             PurchaseOrder: [P],
		                    //             DraftUUID: "00000000-0000-0000-0000-000000000000",
		                    //             IsActiveEntity: "true"
		                    //         }
		                    //     });
		                    // } else {
		                    //     C.toExternal({
		                    //         target: {
		                    //             semanticObject: "PurchaseOrder",
		                    //             action: "manage"
		                    //         },
		                    //         params: {
		                    //             PurchaseOrder: [P],
		                    //             DraftUUID: "00000000-0000-0000-0000-000000000000",
		                    //             IsActiveEntity: "true",
		                    //             "sap-ushell-navmode": "explace"
		                    //         }
		                    //     });
		                    // }
		                }
		            });
		        var s = new sap.m.ToolbarSpacer({ width: "0.25rem" });
		        var j = { "messages": d };
		        var k = new sap.m.ToolbarSpacer({ width: "4rem" });
		        var p = new sap.m.FlexBox({
		            height: "2.5rem",
		            alignItems: "Center",
		            justifyContent: "Start",
		            items: [
		                new sap.m.ToolbarSpacer({ width: "2rem" }),
		                new sap.ui.core.Icon({
		                    color: "#277C16",
		                    src: "sap-icon://message-success"
		                })
		            ]
		        });
		        var T = new sap.m.Table({
		            growing: true,
		            inset: false,
		            fixedLayout: false,
		            backgroundDesign: sap.m.BackgroundDesign.Transparent,
		            showSeparators: "Inner",
		            columns: [new sap.m.Column({
		                    width: "25rem",
		                    styleClass: "name",
		                    hAlign: "Left",
		                    vAlign: "Top"
		                })]
		        });
		        var q = new sap.ui.layout.HorizontalLayout({ content: [r] });
		        var u = new sap.ui.layout.HorizontalLayout({ content: [s] });
		        var v = new sap.ui.layout.HorizontalLayout({ content: [k] });
		        var w = new sap.ui.layout.HorizontalLayout({ content: [i] });
		        var x = new sap.m.ColumnListItem({
		            unread: false,
		            vAlign: "Top",
		            cells: [new sap.ui.layout.Grid({
		                    vSpacing: 0,
		                    hSpacing: 1,
		                    content: [
		                        new sap.m.ObjectStatus({
		                            icon: "{icon}",
		                            state: "{state}",
		                            layoutData: new sap.ui.layout.GridData({ span: "L2 M2 S2" })
		                        }),
		                        new sap.m.Text({
		                            text: "{name}",
		                            layoutData: new sap.ui.layout.GridData({ span: "L10 M10 S10" })
		                        })
		                    ]
		                })]
		        });
		        p.addItem(v);
		        p.addItem(q);
		        p.addItem(u);
		        p.addItem(l);
		        p.addItem(u);
		        p.addItem(w);
		        var W = this.oRouter;
		        var D = this.oApplicationModel;
		        this.vNumberofMessages = j.messages.length;
		        var y = new sap.ui.model.json.JSONModel();
		        j.messages.shift();
		        if (j.messages.length == 0) {
		            T.setVisible(false);
		        }
		        y.setData(j);
		        T.setModel(y);
		        T.bindAggregation("items", "/messages", x);
		        this.oMessageDialog = new sap.m.Dialog({
		            content: [
		                p,
		                T
		            ],
		            buttons: [new sap.m.Button({
		                    text: "{i18n>OK}",
		                    tap: jQuery.proxy(function (e) {
		                        this.oMessageDialog.close();
		                        this.refreshPODrafts();
		                    }, this)
		                })],
		            afterClose: function () {
		                t.byId("idTabContainer").getBinding("items").refresh();
		                t.refreshPODrafts();
		            },
		            state: "None",
		            contentWidth: "35rem"
		        });
		        var z = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("MSG");
		        this.oMessageDialog.setTitle(z + " (" + this.vNumberofMessages + ")");
		        this.getView().addDependent(this.oMessageDialog);
		        this.oMessageDialog.addStyleClass("sapUiSizeCompact");
		        return this.oMessageDialog;
		    }
	});
});
