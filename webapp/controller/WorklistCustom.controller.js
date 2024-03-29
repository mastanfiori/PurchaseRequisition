sap.ui.define([
	"ui/ssuite/s2p/mm/pur/pr/prcss/s1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ui/ssuite/s2p/mm/pur/pr/prcss/s1/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (B, J, H, f, F, a) {
	"use strict";
	return sap.ui.controller("ui.ssuite.s2p.mm.pur.pr.prcss.s1.MM_PR_PRCS1Extension1.controller.WorklistCustom", {
		    formatter: f,
		    onInit: function () {
		        var r = sap.ui.core.UIComponent.getRouterFor(this);
		        this.oRouter = r;
		        this.CreateButtonsEnableCheck();
				this.initView = true;
		        this.bFirstRun = true;
		        this.batchCallNum = 0;
		        this.oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
		        this.getRouter().getRoute("worklist").attachPatternMatched(jQuery.proxy(function (e) {
		            var v = e.getParameter("name");
		            if (v) {
		                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		                this.CreateButtonsEnableCheck();
		                this.oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
		                if (this.byId("idPRItemTable").getBinding("items") != undefined) {
		                    this.byId("idPRItemTable").getBinding("items").refresh();
		                    this.byId("idPRItemTable").removeSelections();
		                }
		            }
		        }, this), this);
				//Extended Code to fetch Parameters from GUI to Filters
				
			this.getGUIParameters();
		    },

			getGUIParameters: function (oEvt) {
				//Fetching Parameters from GUI
				var href = window.location.href;
				if (href.indexOf("PurchaseRequisition") !== -1) {
					var paramstring = href.split("?");
					var paramstr = $.grep(paramstring, function (ele) {
						if (ele.indexOf("PurchaseRequisition") !== -1) {
							return ele;
						}
					})[1];
					if(paramstr !== undefined){
					var paramArr = paramstr.split("&");
					var paramObj = {};
					// debugger;
					paramObj.PurchaseRequisition = "";
					paramObj.PurchaseRequisitionItem = "";
					var purReq = []; var purItem = [];
					
					this.purRequsition = purReq;
					this.purReqItem = purItem;
					$.each(paramArr, function (i, ele) {
						var key = ele.split("=")[0];
						var value = ele.split("=")[1];
						if (key === "PurchaseRequisitionItem") {
							purItem.push(value);
						} else if (key === "PurchaseRequisition") {
							purReq.push(value);
						}
					});
				}
				else{

				}
					// $.each(purReq, function (i, ele) {
					//     var oFilter = new sap.ui.model.Filter("PurchaseRequisition", sap.ui.model.FilterOperator.EQ, ele);
					// 	sFilters.push(oFilter);
					// })
					// $.each(purItem, function (i, ele) {
					// 	sFilters.push(new sap.ui.model.Filter("PurchaseRequisitionItem", sap.ui.model.FilterOperator.EQ, ele));
					// })
	
					// arrayData.forEach(function(item){
					// 	var oFilter = new sap.ui.model.Filter("PurchaseRequisition", sap.ui.model.FilterOperator.EQ, purReq);
					// 	sFilters.push(oFilter);
					// });
					// var oCombinedFilter = new sap.ui.model.Filter(sFilters, sap.ui.model.FilterOperator.AND);
					// oSmartFilterBar.addFilter(oCombinedFilter);
				}
				// this._onInitSmartFilterBar(purReq ,purItem);
				this.byId("idSmartFilterPR").attachInitialized(this._onInitSmartFilterBar.bind(this));
			},
			_onInitSmartFilterBar: function (purReq,purItem) {
				// debugger;
				var data = this.purRequsition;
				var data2 = this.purReqItem;
				let uniqueReq = [...new Set(data)];
				let uniqueItem = [...new Set(data2)];
				var obj = {},arr = [];
				var array=[];
				for(var i = 0; i < uniqueReq.length; i++){
				// 	var oFilterField = this.byId("idSmartFilterPR").getControlByKey("PurchaseRequisition");
				// 	if(oFilterField){
				// 		var Token = new sap.m.Token({
				// 	key: data[i],
				// 	text: data[i]
				// });
				// oFilterField.setTokens(Token);
				// 	}

				var Token = new sap.m.Token({
					key: uniqueReq[i],
					text: uniqueReq[i]
				});
				arr.push(Token);
			}
			var oMultiInput1 = this.byId("idSmartFilterPR").getControlByKey("PurchaseRequisition");
			// var oMultiInput1 = this.byId("PurchaseRequisition");
			oMultiInput1.setTokens(arr);

			for(var j = 0; j < uniqueItem.length; j++){
				var Token2 = new sap.m.Token({
					key: uniqueItem[j],
					text: uniqueItem[j]
				});
				array.push(Token2);
			}
			var oMultiInput = this.byId("idSmartFilterPR").getControlByKey("PurchaseRequisitionItem");
			// var oMultiInput = this.byId("PurchaseRequisitionItem");
			oMultiInput.setTokens(array);
				// for(var i = 0; i < data.length; i++){
				// 	// this.byId("idSmartFilterPR").getControlByKey("PurchaseRequisition").setValue(data[i]);	
				// 	this.byId("idSmartFilterPR").getControlByKey("PurchaseRequisition").setTokens([
				// 		new sap.m.Token({text: data[i], key: data[i]})
				// 	]);
				// }
				// for(var j = 0; j < data2.length; i++){
				// 	this.byId("idSmartFilterPR").getControlByKey("PurchaseRequisitionItem").setTokens([
				// 		new sap.m.Token({text: data2[j], key: data2[j]})
				// 	]);	
				// }
				// var that=this;
				// that.getView().byId("idPRItemTable").rebindTable();
			},
		    
		    setDefaultFitlerParameters: function () {
		        var s = this.oStartupParameters;
		        this.pushFiltertoHeader("PurchasingOrganization", s.PurchasingOrganization);
		        this.pushFiltertoHeader("Plant", s.Plant);
		        this.pushFiltertoHeader("Material", s.Material);
		        this.pushFiltertoHeader("PurchasingGroup", s.PurchasingGroup);
		        this.pushFiltertoHeader("Supplier", s.Supplier);
		        this.pushFiltertoHeader("MaterialGroup", s.MaterialGroup);
		    },
		    pushFiltertoHeader: function (b, c) {
		        if (c) {
		            var s = this.byId("idSmartFilterPR");
		            var o = {};
		            var d = function () {
		                this.value = null;
		                this.ranges = [];
		                this.items = [];
		            };
		            var e = b;
		            o[e] = new d();
		            var g = {};
		            g.keyField = b;
		            g.value1 = c[0];
		            g.operation = "EQ";
		            o[e].ranges.push(g);
		            s.setFilterData(o);
		        }
		    },
		    onNavBack: function (e) {
		        var p = H.getInstance().getPreviousHash();
		        if (p === "#Shell-home") {
		            var s = this.getView().byId("idSmartFilterPR");
		            s.clear();
		        }
		        window.history.go(-1);
		    },
		    onBeforeRebindTable: function (e) {
				
// debugger;
		        var s = [];
		        if (e.getParameter("bindingParams")) {
		            var b = e.getParameter("bindingParams");
		            s = b.sorter || [];
		            var g = s.find(function (O) {
		                return O.vGroup != null;
		            });
		            if (g && g.sPath == "DeliveryDate") {
		                var E = g.bDescending == true ? true : false;
		                var h = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DelivDate") + ": ";
		                b.sorter = [new sap.ui.model.Sorter("DeliveryDate", E, function (O) {
		                        var P = sap.ui.core.format.DateFormat.getInstance({ format: "yMMMd" });
		                        var Q = P.format(O.getProperty("DeliveryDate"));
		                        return {
		                            key: Q,
		                            text: h + Q
		                        };
		                    })].concat(s);
		            }
					debugger;
					//Default Sorting for Material And Plant on 25AUG23
					var mBindingParams = e.getParameter("bindingParams");
				if(this.initView){
				
					 // to apply the sort error
					//  mBindingParams.sorter.push([new sap.ui.model.Sorter({ path: "Material", ascending: true}),new sap.ui.model.Sorter({ path: "Plant", ascending: true})]);
					//  mBindingParams.sorter.push([]);

					 //to sort Initial multiple fileds.
					 mBindingParams.sorter = [new sap.ui.model.Sorter({ path: "Material", ascending: true}),new sap.ui.model.Sorter({ path: "Plant", ascending: true})];
					//  mBindingParams.sorter = [new sap.ui.model.Sorter({ path: "Plant", ascending: true})];
					 // to short the sorted column in P13N dialog
					  var oSmartTable = e.getSource();
					  oSmartTable.applyVariant({
						sort: {
							sortItems: [
								{
								columnKey: "idMaterialyColumnKey",
								operation: "Ascending"
							},
							{
								columnKey: "idPlantColumnKey",
								operation: "Ascending"
							}
						]
						   }
					  });
					 // to prevent applying the initial sort all times 
					this.initView = false;
				}

		        }
		        if (this.bFirstRun === true) {
		            var S = [];
		            s = [];
		            if (this.getTestMode()) {
		                var o = this.oStartupParameters;
		                o.PresentationVariant = ["PRDue"];
		                o.source = "lpd";
		                o.PurReqnHasFllwOnDoc = "PurReqnHasFllwOnDoc 1";
		                o.Supplier = "Supplier 1";
		                o.FixedSupplier = "FixedSupplier 1";
		                o.Material = "Material 1";
		                o.MaterialGroup = "MaterialGroup 1";
		            } else if (sap.ui.core.routing.History.getInstance()._sCurrentDirection === "NewEntry") {
		                this.setDefaultFitlerParameters();
		                var o = this.oStartupParameters;
		            }
		            if (e.getSource().getId().indexOf("idSmartTablePR") > 0) {
		                if (o !== undefined && this.bFirstRun === true) {
		                    if (o.PurchaseRequisition !== undefined) {
		                        var c = o.PurchaseRequisition;
		                    }
		                    if (o.FormattedPurRequisitionItem !== undefined) {
		                        this.bIsNavigatedFromOVP = true;
		                        var d = o.FormattedPurRequisitionItem;
		                    }
		                    if (o.source === "lpd") {
		                        this.navigationToHome = true;
		                    }
		                    if (o.PresentationVariant !== undefined) {
		                        if (!o.FormattedPurRequisitionItem) {
		                            var p = o.PresentationVariant;
		                            if (p[0] === "PRDue") {
		                                var t = this.byId("idPRItemTable");
		                                s = [
		                                    new sap.ui.model.Sorter("FirstDeliveryDate", false),
		                                    new sap.ui.model.Sorter("PurReqnPrice", true)
		                                ];
		                            }
		                        }
		                    }
		                    if (o && sap.ui.core.routing.History.getInstance()._sCurrentDirection === "NewEntry") {
		                        var i = o.Supplier;
		                        var j = o.FixedSupplier;
		                        var k = o.Material;
		                        var l = o.MaterialGroup;
		                        var m = o.PurchasingGroup;
		                        var n = o.PurchasingOrganization;
		                        var q = o.Plant;
		                        if (o.Supplier !== undefined) {
		                            var r = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.EQ, i);
		                            S.push(r);
		                        }
		                        if (o.FixedSupplier !== undefined) {
		                            var u = new sap.ui.model.Filter("FixedSupplier", sap.ui.model.FilterOperator.EQ, j);
		                            S.push(u);
		                        }
		                        if (o.Material !== undefined) {
		                            var v = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, k);
		                            S.push(v);
		                        }
		                        if (o.MaterialGroup !== undefined) {
		                            var w = new sap.ui.model.Filter("MaterialGroup", sap.ui.model.FilterOperator.EQ, l);
		                            S.push(w);
		                        }
		                        if (o.PurchasingGroup !== undefined) {
		                            var x = new sap.ui.model.Filter("PurchasingGroup", sap.ui.model.FilterOperator.EQ, m);
		                            S.push(x);
		                        }
		                        if (o.PurchasingOrganization !== undefined) {
		                            var y = new sap.ui.model.Filter("PurchasingOrganization", sap.ui.model.FilterOperator.EQ, n);
		                            S.push(y);
		                        }
		                        if (o.Plant !== undefined) {
		                            var z = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, q);
		                            S.push(z);
		                        }
		                    }
		                    if (o.PurReqnHasFllwOnDoc !== undefined) {
		                        var A = o.PurReqnHasFllwOnDoc;
		                        var C = new sap.ui.model.Filter("PurReqnHasFllwOnDoc", sap.ui.model.FilterOperator.EQ, A);
		                        S.push(C);
		                    }
		                }
		                for (var D in d) {
		                    var G = d[D];
		                    var t = this.byId("idPRItemTable");
		                    var I = t.getBinding("items");
		                    G = G.replace(/\s+/g, "");
		                    var K = G.split(/[.?/]/)[0];
		                    var L = G.split(/[.?/]/)[1];
		                    this.byId("idSmartFilterPR").getBasicSearchControl().setValue(K);
		                    var M = new sap.ui.model.Filter("PurchaseRequisition", sap.ui.model.FilterOperator.Contains, K);
		                    S.push(M);
		                    var N = new sap.ui.model.Filter("PurchaseRequisitionItem", sap.ui.model.FilterOperator.Contains, L);
		                    S.push(N);
		                }
		                // if (c) {
		                //     var M = new sap.ui.model.Filter("PurchaseRequisition", sap.ui.model.FilterOperator.Contains, c);
		                //     this.byId("idSmartFilterPR").getBasicSearchControl().setValue(c);
		                //     S.push(M);
		                // }
		                this.bFirstRun = false;
		            }
		            if (S.length > 0) {
		                e.getParameter("bindingParams").filters = S;
		            }
		            if (s.length > 0) {
		                e.getParameter("bindingParams").sorter = s;
		            }
		        }
		    },
		    getMyComponent: function () {
		        "use strict";
		        var c = sap.ui.core.Component.getOwnerIdFor(this.getView());
		        return sap.ui.component(c);
		    },
		    onUpdateFinished: function (e) {
		        var t, T = e.getSource(), i = e.getParameter("total");
		        if (i && T.getBinding("items").isLengthFinal()) {
		            t = this.getResourceBundle().getText("worklistTableTitleCount", [i]);
		        } else {
		            t = this.getResourceBundle().getText("worklistTableTitle");
		        }
		        this.getModel("worklistView").setProperty("/worklistTableTitle", t);
		    },
		    onPressPurReqn: function (e) {
		        var s = e.getSource().getBindingContext().getObject();
		        var S = s.PurchaseRequisition;
		        var c = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
		        c.toExternal({
		            target: {
		                semanticObject: "PurchaseRequisition",
		                action: "maintain"
		            },
		            params: {
		                DraftUUID: "00000000-0000-0000-0000-000000000000",
		                PurchaseRequisition: S,
		                IsActiveEntity: "true"
		            }
		        });
		    },
		    onPressMaterialFactSheet: function (e) {
		        var s = e.getSource().getBindingContext().getObject();
		        var c = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
		        c.toExternal({
		            target: {
		                semanticObject: "Material",
		                action: "displayFactSheet"
		            },
		            params: { Material: [s.Material] }
		        });
		    },
		    onPressSuppBusinessCard: function (e) {
		        this.idSourceVendorFgt = e.getSource().getId();
		        var v = e.getSource().getBindingContext().getObject().FixedSupplier;
		        if (v === "" || v === undefined) {
		            v = e.getSource().getBindingContext().getObject().Supplier;
		        }
		        var m = this.getModel();
		        var u = "/VendorSet(Supplier='" + v + "')";
		        if (!this._oPopover) {
		            this._oPopover = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.fragment.BusinessCard", this);
		            this.getView().addDependent(this._oPopover);
		        } else if (this._oPopover.bIsDestroyed) {
		            this._oPopover = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.fragment.BusinessCard", this);
		            this.getView().addDependent(this._oPopover);
		        }
		        var p = { success: jQuery.proxy(this.BusinessCardData, this) };
		        m.read(u, p);
		        var o = e.getSource();
		        jQuery.sap.delayedCall(0, this, function () {
		            this._oPopover.openBy(o);
		        });
		    },
		    onCallAfterClose: function (e) {
		        this._oPopover.destroy();
		    },
		    callBusinessCard: function (e) {
		        sap.m.URLHelper.triggerTel(e.getSource().getText());
		    },
		    emailBusinessCard: function (e) {
		        sap.m.URLHelper.triggerEmail(e.getSource().getText());
		    },
		    BusinessCardData: function (d, r) {
		        this._oPopover.setModel(new sap.ui.model.json.JSONModel(d));
		        this._oPopover.setContentHeight("auto");
		    },
		    CreateButtonsEnableCheck: function (e, i) {
		        if (this.bIsContractPreview) {
		            this.byId("smartFilterId").getBasicSearchControl().fireSearch();
		        }
		        var s = this.byId("idPRItemTable").getSelectedContexts();
		        var I, d, E, b, c;
		        E = true;
		        b = true;
		        c = true;
		        if (s.length == 0) {
		            E = false;
		            b = false;
		            c = false;
		        } else {
		            for (I = 0; I < s.length; I++) {
		                d = s[I].getProperty(s[I].getPath());
		                if ((d.FixedSupplier === null || d.FixedSupplier === undefined || d.FixedSupplier === "") && (d.Supplier === null || d.Supplier === undefined || d.Supplier === "")) {
		                    E = false;
		                } else if (parseFloat(d.OrderedQuantity) >= parseFloat(d.RequestedQuantity)) {
		                    b = false;
		                    c = false;
		                    E = d.PurchasingDocumentItemCategory === "A" ? true : false;
		                }
		                E = d.PurchasingDocumentSubtype === "R" ? false : E;
		                c = d.ProcessingStatus === "K" && d.PurchasingDocumentSubtype === "R" ? false : c;
		                b = d.ProcessingStatus === "K" && d.PurchasingDocumentSubtype === "R" ? false : b;
		                c = d.PurchasingDocumentItemCategory !== "0" ? false : c;
		                b = d.PurchasingDocumentItemCategory !== "0" ? false : b;
		                c = d.PurchasingDocumentItemCategory === "A" ? false : c;
		                if (d.PurReqnCmpltnsCat === "H" || d.PurReqnCmpltnsCat === "P") {
		                    E = false;
		                    b = false;
		                    c = false;
		                    break;
		                }
		            }
		        }
		        this.byId("CreatePO").setEnabled(E);
		        this.byId("CreateRFQ").setEnabled(b);
		        this.byId("CreateCTR").setEnabled(c);
		        if (i === "PO") {
		            return E;
		        } else if (i === "CTR") {
		            return c;
		        } else {
		            return b;
		        }
		    },
		    onPressCreateDraftPO: function (e) {
		        this.onPressCreateDraft(e, "PO");
		    },
		    onPressCreateDraftRFQ: function (e) {
		        var s = this.byId("idPRItemTable").getSelectedContexts();
		        if (s.length === 0) {
		            var E = new Array();
		            var m;
		            var o = {
		                name: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errPRIsSelected"),
		                state: this._getMessageState("error"),
		                icon: this._getMessageIcon("error")
		            };
		            E.push(o);
		            m = this._getMessagePopup(E);
		            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), m);
		            m.open();
		            return;
		        }
		        var b = s[0].getProperty(s[0].getPath());
		        var p = b.PurchasingOrganization;
		        var P = b.PurchasingGroup;
		        var c = true;
		        var n = false;
		        var I = true;
		        var A = new Array();
		        var m;
		        for (var i = 1; i < s.length; i++) {
		            var d = s[i].getProperty(s[i].getPath());
		            if (p !== d.PurchasingOrganization || P !== d.PurchasingGroup) {
		                var g = {
		                    name: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("PopUpTxt"),
		                    state: this._getMessageState("error"),
		                    icon: this._getMessageIcon("error")
		                };
		                A.push(g);
		                c = false;
		                break;
		            }
		        }
		        for (i = 0; i < s.length; i++) {
		            var r = s[i].getProperty(s[i].getPath());
		            if (r.PurchasingDocumentItemCategory !== "0" && r.PurchasingDocumentItemCategory !== "5") {
		                var h = {
		                    name: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errPRCategory") + " " + r.PurchaseRequisition + "/" + r.PurchaseRequisitionItem,
		                    state: this._getMessageState("error"),
		                    icon: this._getMessageIcon("error")
		                };
		                A.push(h);
		            } else if (r.Cityname === "" || r.Country === "") {
		                var h = {
		                    name: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errAdd") + " " + r.PurchaseRequisition + "/" + r.PurchaseRequisitionItem,
		                    state: this._getMessageState("error"),
		                    icon: this._getMessageIcon("error")
		                };
		                A.push(h);
		            }
		        }
		        if (A.length > 0) {
		            m = this._getMessagePopup(A, n, I);
		            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), m);
		            m.open();
		        } else if (c === true) {
		            var j = e.getSource().getId();
		            var k = j.match("CreateRFQ");
		            if (k !== null || k !== undefined) {
		                this.onPressCreateDraft(e, "CreateRFQ");
		            }
		        }
		    },
		    onPressCreateDraftCTR: function (e) {
		        this.onPressCreateDraft(e, "CreateCTR");
		    },
		    onPressCreateDraft: function (e, i) {
		        var s = this.byId("idPRItemTable").getSelectedContexts();
		        if (s.length === 0) {
		            var E = new Array();
		            var m;
		            var o = {
		                name: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errPRIsSelected"),
		                state: this._getMessageState("error"),
		                icon: this._getMessageIcon("error")
		            };
		            E.push(o);
		            m = this._getMessagePopup(E);
		            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), m);
		            m.open();
		            return;
		        }
		        var b = [];
		        if (i === "PO") {
		            var A = this.CreateButtonsEnableCheck(e, "PO");
		        } else if (i === "CreateCTR") {
		            var A = this.CreateButtonsEnableCheck(e, "CTR");
		        } else {
		            var A = this.CreateButtonsEnableCheck();
		        }
		        if (A === true) {
		            var c;
		            this.byId("CreatePO").setEnabled(false);
		            this.byId("CreateRFQ").setEnabled(false);
		            this.byId("CreateCTR").setEnabled(false);
		            var s = this.byId("idPRItemTable").getSelectedContexts();
		            if (i === "CreateRFQ") {
		                c = "RFQ";
		            } else if (i === "CreateCTR") {
		                c = "CONTR";
		            } else {
		                c = "PO";
		            }
		            this.batchCallNum = 0;
		            for (var S = 0; S < s.length; S++) {
		                var C = s[S].getProperty(s[S].getPath());
		                if (!C.PurchaseRequisitionItem) {
		                    var d = s[S].getPath();
		                    var g = d.split("'");
		                    C.PurchaseRequisitionItem = g[3];
		                }
		                var p = {
		                    "Purchaserequisition": C.PurchaseRequisition,
		                    "Purchaserequisitionitem": C.PurchaseRequisitionItem,
		                    "Followondocumenttype": c
		                };
		                if (!this.getTestMode()) {
		                    this.getModel().callFunction("/CreateDrafts", {
		                        method: "POST",
		                        urlParameters: p,
		                        success: jQuery.proxy(this.successCreateDraft, this, c),
		                        error: jQuery.proxy(this.errorCreateDraft, this)
		                    });
		                    this.batchCallNum = this.batchCallNum + 1;
		                } else if (c === "CONTR") {
		                    this.oRouter.navTo("ContractPreview");
		                } else {
		                    this.oRouter.navTo("PurchaseOrderPreview");
		                }
		            }
		        }
		    },
		    successCreateDraft: function (d, b, r) {
		        var n = true;
		        if (b.__batchResponses !== undefined) {
		            var c = b.__batchResponses[0].__changeResponses.length;
		        } else if (r.headers["sap-message"] !== undefined && (JSON.parse(r.headers["sap-message"]).code === "APPL_MM_PR/014" || JSON.parse(r.headers["sap-message"]).code === "APPL_MM_PR/015" || JSON.parse(r.headers["sap-message"]).code === "APPL_MM_PR/016" || JSON.parse(r.headers["sap-message"]).code === "APPL_MM_PR/017")) {
		            var p = true;
		        } else {
		            var c = 0;
		        }
		        var e = new Array();
		        if (r.headers["sap-message"]) {
		            var m = JSON.parse(r.headers["sap-message"]).details;
		            var M = JSON.parse(r.headers["sap-message"]);
		            var E = {
		                name: M.message,
		                state: this._getMessageState(M.severity),
		                icon: this._getMessageIcon(M.severity)
		            };
		            if (d === "PO" && JSON.parse(r.headers["sap-message"]).code === "APPL_MM_PR/019") {
		                n = false;
		            }
		            e.push(E);
		            if (m !== undefined) {
		                if (m.length > 0) {
		                    for (var g = 0; g < m.length; g++) {
		                        E = {
		                            name: m[g].message,
		                            state: this._getMessageState(m[g].severity),
		                            icon: this._getMessageIcon(m[g].severity)
		                        };
		                        e.push(E);
		                        if (d === "PO") {
		                            if (JSON.parse(r.headers["sap-message"]).details[g].code === "APPL_MM_PR/019") {
		                                n = false;
		                            }
		                        }
		                    }
		                }
		            }
		        }
		        var R = new Array();
		        if (d === "RFQ") {
		            if (r.headers["sap-message"]) {
		                var P;
		                var v = JSON.parse(r.headers["sap-message"]).code;
		                var h = JSON.parse(r.headers["sap-message"]);
		                var j = JSON.parse(r.headers["sap-message"]).details;
		                if (v === "MM_PUR_RFQ/047" || h.severity === "error") {
		                    P = {
		                        name: h.message,
		                        state: this._getMessageState(h.severity),
		                        icon: this._getMessageIcon(h.severity)
		                    };
		                    R.push(P);
		                } else if (j !== undefined) {
		                    if (j.length > 0) {
		                        for (var i = 0; i < j.length; i++) {
		                            if (j[i].code === "MM_PUR_RFQ/047" || h.severity === "error") {
		                                P = {
		                                    name: j[i].message,
		                                    state: this._getMessageState(j[i].severity),
		                                    icon: this._getMessageIcon(j[i].severity)
		                                };
		                                R.push(P);
		                                break;
		                            }
		                        }
		                    }
		                }
		            }
		            var k;
		            if (r.headers["sap-message"]) {
		                var v = JSON.parse(r.headers["sap-message"]).code;
		                var j = JSON.parse(r.headers["sap-message"]).details;
		                if (d === "PO" && v === "APPL_MM_PR/019") {
		                    n = false;
		                }
		                if (v === "DraftId/101") {
		                    k = JSON.parse(r.headers["sap-message"]).message;
		                } else if (j !== undefined) {
		                    if (j.length > 0) {
		                        for (var i = 0; i < j.length; i++) {
		                            if (JSON.parse(r.headers["sap-message"]).details[i].code === "DraftId/101") {
		                                k = JSON.parse(r.headers["sap-message"]).details[i].message;
		                                break;
		                            }
		                        }
		                    }
		                }
		            }
		        }
		        var N = 0;
		        if (p) {
		            n = false;
		            var g = 0;
		            var j = JSON.parse(r.headers["sap-message"]).details;
		            var C = new Array();
		            var o = {
		                name: JSON.parse(r.headers["sap-message"]).message,
		                state: this._getMessageState(JSON.parse(r.headers["sap-message"]).severity),
		                icon: this._getMessageIcon(JSON.parse(r.headers["sap-message"]).severity)
		            };
		            C.push(o);
		            N = N + 1;
		            for (g = 0; g < j.length; g++) {
		                o = {
		                    name: j[g].message,
		                    state: this._getMessageState(j[g].severity),
		                    icon: this._getMessageIcon(j[g].severity)
		                };
		                if (j[g].severity === "warning" || j[g].severity === "error") {
		                    C.push(o);
		                    N = N + 1;
		                }
		            }
		            var l = this._getMessagePopup(C, n, false);
		            if (N > 0) {
		                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), l);
		                l.open();
		            }
		        } else if (c > 0) {
		            if (b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]) {
		                var g = 0;
		                var j = JSON.parse(b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]).details;
		                var C = new Array();
		                var o = {
		                    name: JSON.parse(b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]).message,
		                    state: this._getMessageState(JSON.parse(b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]).severity),
		                    icon: this._getMessageIcon(JSON.parse(b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]).severity)
		                };
		                if (JSON.parse(b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]).severity === "warning" || JSON.parse(b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]).severity === "error") {
		                    if (JSON.parse(b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]).code === "NO_NAV/100" && JSON.parse(b.__batchResponses[0].__changeResponses[c - 1].headers["sap-message"]).message === "S:NO_NAV:100")
		                        n = false;
		                    else {
		                        C.push(o);
		                        N = N + 1;
		                    }
		                }
		                for (g = 0; g < j.length; g++) {
		                    o = {
		                        name: j[g].message,
		                        state: this._getMessageState(j[g].severity),
		                        icon: this._getMessageIcon(j[g].severity)
		                    };
		                    if (j[g].severity === "warning" || j[g].severity === "error") {
		                        if (j[g].code === "NO_NAV/100" && j[g].message === "S:NO_NAV:100") {
		                            n = false;
		                        } else {
		                            C.push(o);
		                            N = N + 1;
		                        }
		                    }
		                }
		                if (d === "PO") {
		                    var l = this._getMessagePopup(C, n, false);
		                } else if (d === "CONTR") {
		                    var l = this._getMessagePopup(C, n, false);
		                } else if (d === "RFQ") {
		                    var l = this._getMessagePopup(C, n, true, k);
		                }
		                if (N > 0) {
		                    jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), l);
		                    l.open();
		                } else {
		                    if (d === "PO") {
		                        this.oRouter.navTo("PurchaseOrderPreview");
		                    } else if (d === "CONTR") {
		                        this.oRouter.navTo("ContractPreview");
		                    } else {
		                        if (k) {
		                            this.oRouter.navTo("RFQPreview", { RFQid: k });
		                        }
		                    }
		                }
		            }
		        } else {
		            if (d === "PO") {
		                if (this.batchCallNum == 1) {
		                    if (e.length > 0) {
		                        var l = this._getMessagePopup(e, n, false);
		                        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), l);
		                        l.open();
		                    } else {
		                        this.oRouter.navTo("PurchaseOrderPreview");
		                    }
		                }
		            } else if (d === "CONTR") {
		                this.oRouter.navTo("ContractPreview");
		            } else {
		                if (R.length > 0) {
		                    var l = this._getMessagePopup(R, n, true);
		                    jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), l);
		                    l.open();
		                } else {
		                    if (k) {
		                        k = k.substr(0, 8) + "-" + k.substr(8, 4) + "-" + k.substr(12, 4) + "-" + k.substr(16, 4) + "-" + k.substr(20, 12);
		                        this.oRouter.navTo("RFQPreview", { RFQid: k });
		                    }
		                }
		            }
		        }
		        if (this.batchCallNum > 1) {
		            this.batchCallNum = this.batchCallNum - 1;
		        }
		    },
		    errorCreateDraft: function (e) {
		    },
		    _getMessageState: function (s) {
		        switch (s) {
		        case "error":
		            return sap.ui.core.ValueState.Error;
		        case "Error":
		            return sap.ui.core.ValueState.Error;
		        case "warning":
		            return sap.ui.core.ValueState.Warning;
		        case "Warning":
		            return sap.ui.core.ValueState.Warning;
		        case "success":
		            return sap.ui.core.ValueState.Success;
		        case "Success":
		            return sap.ui.core.ValueState.Success;
		        case "information":
		            return sap.ui.core.ValueState.Success;
		        case "info":
		            return sap.ui.core.ValueState.Success;
		        }
		    },
		    _getMessageIcon: function (s) {
		        switch (s) {
		        case "error":
		            return "sap-icon://error";
		        case "Error":
		            return "sap-icon://error";
		        case "warning":
		            return "sap-icon://notification";
		        case "Warning":
		            return "sap-icon://notification";
		        case "Success":
		            return "sap-icon://sys-enter";
		        case "success":
		            return "sap-icon://sys-enter";
		        case "information":
		            return "sap-icon://sys-enter";
		        case "info":
		            return "sap-icon://sys-enter";
		        }
		    },
		    _getMessagePopup: function (m, n, i, R) {
		        var d = { "messages": m };
		        var t = new sap.m.Table({
		            growing: true,
		            inset: false,
		            fixedLayout: false,
		            backgroundDesign: sap.m.BackgroundDesign.Transparent,
		            showSeparators: "Inner",
		            columns: [new sap.m.Column({
		                    width: "0rem",
		                    styleClass: "name",
		                    hAlign: "Left",
		                    vAlign: "Top"
		                })]
		        });
		        var b = new sap.m.ColumnListItem({
		            unread: false,
		            vAlign: "Top",
		            cells: [new sap.ui.layout.Grid({
		                    vSpacing: 18,
		                    hSpacing: 0,
		                    content: [
		                        new sap.m.ObjectStatus({
		                            icon: "{icon}",
		                            state: "{state}",
		                            layoutData: new sap.ui.layout.GridData({ span: "L1 M1 S1" })
		                        }),
		                        new sap.m.Text({
		                            text: "{name}",
		                            layoutData: new sap.ui.layout.GridData({ span: "L10 M10 S10" })
		                        })
		                    ]
		                })]
		        });
		        this.vNumberofMessages = d.messages.length;
		        var M = new sap.ui.model.json.JSONModel();
		        M.setData(d);
		        t.setModel(M);
		        t.bindAggregation("items", "/messages", b);
		        this.oMessageDialog = new sap.m.Dialog({
		            content: [t],
		            buttons: [new sap.m.Button({
		                    text: "{i18n>Close}",
		                    press: jQuery.proxy(function (e) {
		                        this.oMessageDialog.close();
		                        if (n == true && i == false) {
		                            this.oRouter.navTo("PurchaseOrderPreview");
		                        }
		                    }, this)
		                })],
		            state: "None",
		            contentWidth: "25rem"
		        });
		        if (i === true) {
		            var c = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("Error");
		            this.oMessageDialog.setTitle(c + " (" + this.vNumberofMessages + ")");
		        } else {
		            var g = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("MSG");
		            this.oMessageDialog.setTitle(g + " (" + this.vNumberofMessages + ")");
		        }
		        this.getView().addDependent(this.oMessageDialog);
		        this.oMessageDialog.addStyleClass("sapUiSizeCompact");
		        return this.oMessageDialog;
		    },
		    onPressEdit: function (e) {
		        this.isSupplierLengthExceeding = false;
		        this.isDateValid = true;
		        this.isQtyLengthExeeding = false;
		        this.setEditModelData(e);
		        this.openDialog("editDialog");
		    },
		    setEditModelData: function (e) {
		        var p = e.getSource().getModel().getProperty("PurchaseRequisition", e.getSource().getBindingContext());
		        var P = e.getSource().getModel().getProperty("PurchaseRequisitionItem", e.getSource().getBindingContext());
		        var s = e.getSource().getModel().getProperty("PurReqnSourceOfSupplyCount", e.getSource().getBindingContext());
		        var q = e.getSource().getModel().getProperty("RequestedQuantity", e.getSource().getBindingContext());
		        var d = e.getSource().getModel().getProperty("Supplier", e.getSource().getBindingContext());
		        var D = e.getSource().getModel().getProperty("DeliveryDate", e.getSource().getBindingContext());
		        if (D === null || D === undefined) {
		            D = new Date();
		        }
		        var E = e.getSource().getModel().getProperty("PerformancePeriodEndDate", e.getSource().getBindingContext());
		        var S = e.getSource().getModel().getProperty("PerformancePeriodStartDate", e.getSource().getBindingContext());
		        var v = e.getSource().getModel().getProperty("ProductType", e.getSource().getBindingContext());
		        var Q = e.getSource().getModel().getProperty("BaseUnit", e.getSource().getBindingContext());
		        var b = e.getSource().getModel().getProperty("PurchaseRequisitionItemText", e.getSource().getBindingContext());
		        var m = e.getSource().getModel().getProperty("Material", e.getSource().getBindingContext());
		        var c = e.getSource().getModel().getProperty("Plant", e.getSource().getBindingContext());
		        var g = e.getSource().getModel().getProperty("FixedSupplier", e.getSource().getBindingContext());
		        var C = e.getSource().getModel().getProperty("PurReqnItemCurrency", e.getSource().getBindingContext());
		        var i = e.getSource().getModel().getProperty("PurchasingInfoRecord", e.getSource().getBindingContext());
		        var h = e.getSource().getModel().getProperty("PurchasingDocumentItemCategory", e.getSource().getBindingContext());
		        var j = e.getSource().getModel().getProperty("PurchaseContract", e.getSource().getBindingContext());
		        var k = e.getSource().getModel().getProperty("PurchaseContractItem", e.getSource().getBindingContext());
		        var r = e.getSource().getModel().getProperty("PurReqnSourceOfSupplyType", e.getSource().getBindingContext());
		        var A = e.getSource().getModel().getProperty("AccountAssignmentCategory", e.getSource().getBindingContext());
		        var l = e.getSource().getModel().getProperty("ConsumptionPosting", e.getSource().getBindingContext());
		        var M = e.getSource().getModel().getProperty("MaterialGroup", e.getSource().getBindingContext());
		        var n = e.getSource().getModel().getProperty("PurchasingOrganization", e.getSource().getBindingContext());
		        var o = {
		            "Purchaserequisition": p,
		            "Purchaserequisitionitem": P,
		            "Sos_count": s,
		            "Quantity": q,
		            "Supplier": d,
		            "Materialbaseunit": Q,
		            "Deliverydate": D,
		            "Purchaserequisitionitemtext": b,
		            "Upd_scenario": "E",
		            "Material": m,
		            "Plant": c,
		            "Fixedvendor": g,
		            "Purchasinginforecord": i,
		            "Purgdoctransactioncurrency": C,
		            "PurchasingDocumentItemCategory": h,
		            "PurchaseContract": j,
		            "PurchaseContractItem": k,
		            "RequisitionSourceOfSupplyType": r,
		            "Acctassignmentcategory": A,
		            "Consumptionposting": l,
		            "Materialgroup": M,
		            "Purchasingorganization": n,
		            "ProductType": v,
		            "PerformancePeriodStartDate": S,
		            "PerformancePeriodEndDate": E
		        };
		        this.oModelEdit = new sap.ui.model.json.JSONModel(o);
		    },
		    openDialog: function (s) {
		        switch (s) {
		        case "editDialog": {
		                if (!this[s]) {
		                    this[s] = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.editDialog", this);
		                }
		                this[s].setModel(this.oModelEdit);
		                this.getView().addDependent(this[s]);
		                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this[s]);
		                this[s].open();
		            }
		        case "SoSDialog": {
		                if (!this[s]) {
		                    this[s] = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.SosDialog", this);
		                    this.getView().addDependent(this[s]);
		                }
		                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this[s]);
		                this[s].open();
		            }
		        }
		    },
		    onEditDialogCloseButton: function (e) {
		        var d = sap.ui.getCore().byId("supplierF4multiInput");
		        if (d.getValueState() === "Error") {
		            d.setValueState(sap.ui.core.ValueState.None);
		            d.setValueStateText("");
		        }
		        var b = sap.ui.getCore().byId("editDialog");
		        b.close();
		    },
		    onStartDateChanged: function (e) {
		        this.bStartDateChanged = true;
		        var v, V, d;
		        if (e === undefined) {
		            d = sap.ui.getCore().byId("StartDate");
		            v = d.getDateValue();
		            V = true;
		        } else {
		            d = sap.ui.getCore().byId("StartDate");
		            v = d.getDateValue();
		        }
		        if (v) {
		            if (e !== undefined)
		                V = e.getParameter("valid");
		            this._iEvent++;
		            var t = new Date();
		            var s = sap.ui.getCore().getConfiguration().getLanguage();
		            var l = new sap.ui.core.Locale(s);
		            var b = sap.ui.core.format.DateFormat.getDateInstance({}, l);
		            if (V) {
		                var S = b.format(new Date(v));
		                d.setValueState(sap.ui.core.ValueState.None);
		                if (this.isSupplierLengthExceeding === false && this.isDateValid === true && this.isQtyLengthExeeding === false) {
		                    sap.ui.getCore().byId("idEditOk").setEnabled(true);
		                }
		                this.StartDate = v;
		                if (sap.ui.getCore().byId("idEditOk").getEnabled() === true && e !== undefined) {
		                    this.onInputQuantityChanged();
		                }
		            } else {
		                d.setValueState(sap.ui.core.ValueState.Error);
		                sap.ui.getCore().byId("idEditOk").setEnabled(false);
		                d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DelivDateValid"));
		            }
		        } else {
		            d.setValueState(sap.ui.core.ValueState.Error);
		            sap.ui.getCore().byId("idEditOk").setEnabled(false);
		            d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("EditMessage"));
		        }
		    },
		    onEndDateChanged: function (e) {
		        this.bEndDateChanged = true;
		        var v, V, d;
		        if (e === undefined) {
		            d = sap.ui.getCore().byId("EndDate");
		            v = d.getValue();
		            V = true;
		        } else {
		            d = sap.ui.getCore().byId("EndDate");
		            v = d.getDateValue();
		        }
		        if (v) {
		            if (e !== undefined)
		                V = e.getParameter("valid");
		            this._iEvent++;
		            var t = new Date();
		            var s = sap.ui.getCore().getConfiguration().getLanguage();
		            var l = new sap.ui.core.Locale(s);
		            var b = sap.ui.core.format.DateFormat.getDateInstance({}, l);
		            if (V) {
		                var E = b.format(new Date(v));
		                d.setValueState(sap.ui.core.ValueState.None);
		                if (this.isSupplierLengthExceeding === false && this.isDateValid === true && this.isQtyLengthExeeding === false) {
		                    sap.ui.getCore().byId("idEditOk").setEnabled(true);
		                }
		                this.EndDate = v;
		                if (sap.ui.getCore().byId("idEditOk").getEnabled() === true && e !== undefined) {
		                    this.onInputQuantityChanged();
		                }
		            } else {
		                d.setValueState(sap.ui.core.ValueState.Error);
		                sap.ui.getCore().byId("idEditOk").setEnabled(false);
		                d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DelivDateValid"));
		            }
		        } else {
		            d.setValueState(sap.ui.core.ValueState.Error);
		            sap.ui.getCore().byId("idEditOk").setEnabled(false);
		            d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("EditMessage"));
		        }
		    },
		    onDateChanged: function (e) {
		        this.bDateChanged = true;
		        var v, V, d;
		        if (e === undefined) {
		            d = sap.ui.getCore().byId("Date");
		            v = d.getDateValue();
		            V = true;
		        } else {
		            d = sap.ui.getCore().byId("Date");
		            v = d.getDateValue();
		        }
		        if (v) {
		            if (e !== undefined)
		                V = e.getParameter("valid");
		            this._iEvent++;
		            var t = new Date();
		            var s = sap.ui.getCore().getConfiguration().getLanguage();
		            var l = new sap.ui.core.Locale(s);
		            var b = sap.ui.core.format.DateFormat.getDateInstance({}, l);
		            if (V) {
		                this.isDateValid = true;
		                var c = b.format(new Date(v));
		                d.setValueState(sap.ui.core.ValueState.None);
		                if (this.isSupplierLengthExceeding === false && this.isDateValid === true && this.isQtyLengthExeeding === false) {
		                    sap.ui.getCore().byId("idEditOk").setEnabled(true);
		                }
		                this.deliverydate = v;
		                if (sap.ui.getCore().byId("idEditOk").getEnabled() === true && e !== undefined) {
		                    this.onInputQuantityChanged();
		                }
		            } else {
		                this.isDateValid = false;
		                d.setValueState(sap.ui.core.ValueState.Error);
		                sap.ui.getCore().byId("idEditOk").setEnabled(false);
		                d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DelivDateValid"));
		            }
		        } else {
		            this.isDateValid = false;
		            d.setValueState(sap.ui.core.ValueState.Error);
		            sap.ui.getCore().byId("idEditOk").setEnabled(false);
		            d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("EditMessage"));
		        }
		    },
		    onInputQuantityChanged: function (e) {
		        var v, d;
		        if (e === undefined) {
		            d = sap.ui.getCore().byId("idEditQuantity");
		            v = d.getValue();
		        } else {
		            v = e.getParameter("value");
		            d = e.getSource();
		        }
		        if (parseFloat(v) == v) {
		            var n = v.split(".");
		            if (n[0].length > 10 || n[0].match(/^[0-9]+$/) === null) {
		                this.isQtyLengthExeeding = true;
		                sap.ui.getCore().byId("idEditOk").setEnabled(false);
		                d.setValueState(sap.ui.core.ValueState.Error);
		                d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errValidQty"));
		                return;
		            } else {
		                this.isQtyLengthExeeding = false;
		            }
		            if (n[1] !== undefined) {
		                if (n[1].length > 3) {
		                    sap.ui.getCore().byId("idEditOk").setEnabled(false);
		                    d.setValueState(sap.ui.core.ValueState.Error);
		                    d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errValidQty"));
		                    return;
		                }
		            }
		            d.setValueState(sap.ui.core.ValueState.None);
		            if (this.isSupplierLengthExceeding === false && this.isDateValid === true && this.isQtyLengthExeeding === false) {
		                sap.ui.getCore().byId("idEditOk").setEnabled(true);
		            }
		            if (e !== undefined)
		                this.onDateChanged();
		        } else {
		            sap.ui.getCore().byId("idEditOk").setEnabled(false);
		            d.setValueState(sap.ui.core.ValueState.Error);
		            d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errMandatoryQty"));
		        }
		        this.isQtyLengthExeeding = false;
		    },
		    onChangeSupplier: function (e) {
		        var u = e.getSource().getValue();
		        var d = sap.ui.getCore().byId("supplierF4multiInput");
		        if (u.length > 10) {
		            sap.ui.getCore().byId("idEditOk").setEnabled(false);
		            d.setValueState(sap.ui.core.ValueState.Error);
		            d.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("errSupplier"));
		            this.isSupplierLengthExceeding = true;
		            return;
		        }
		        this.isSupplierLengthExceeding = false;
		        d.setValueState(sap.ui.core.ValueState.None);
		        if (this.isSupplierLengthExceeding === false && this.isDateValid === true && this.isQtyLengthExeeding === false) {
		            sap.ui.getCore().byId("idEditOk").setEnabled(true);
		        }
		        e.getSource().getModel().getData().tempSupplier = u;
		    },
		    onSupplierValueHelpRequest: function (e) {
		        this.oResourceBundle = this.getResourceBundle();
		        var m = this.getModel();
		        m.read("/C_MM_SupplierValueHelp", {
		            urlParameters: {},
		            success: jQuery.proxy(this.getSupplierListSuccess, this),
		            error: jQuery.proxy(this.getSupplierListFailure, this)
		        });
		    },
		    getSupplierListSuccess: function (r) {
		        var i = sap.ui.getCore().byId("supplierF4multiInput");
		        var s = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
		            title: this.oResourceBundle.getText("SUP"),
		            modal: true,
		            supportMultiselect: false,
		            supportRanges: false,
		            supportRangesOnly: false,
		            key: "Supplier",
		            descriptionKey: "SupplierName",
		            ok: jQuery.proxy(function (C) {
		                var u = i.setValue(C.getParameter("tokens")[0].getKey());
		                i.getModel().getData().tempSupplier = u;
		                i.getModel().getData().FixedVendorSet = false;
		                s.close();
		                i.fireChange();
		            }, this),
		            cancel: function (C) {
		                s.close();
		            },
		            afterClose: function () {
		                s.destroy();
		            }
		        });
		        s.setKey("Supplier");
		        s.setKeys([
		            "Supplier",
		            "SupplierName"
		        ]);
		        s.setRangeKeyFields([
		            {
		                label: this.oResourceBundle.getText("SID"),
		                key: "Supplier"
		            },
		            {
		                label: this.oResourceBundle.getText("SNAME"),
		                key: "SupplierName"
		            }
		        ]);
		        s.setTokens(i.getTokens());
		        var b = new sap.ui.model.json.JSONModel();
		        b.setData({
		            cols: [
		                {
		                    label: this.oResourceBundle.getText("SID"),
		                    template: "Supplier"
		                },
		                {
		                    label: this.oResourceBundle.getText("SNAME"),
		                    template: "SupplierName"
		                }
		            ]
		        });
		        s.setModel(b, "columns");
		        var c = new sap.ui.model.json.JSONModel();
		        c.setData(r.results);
		        s.setModel(c);
		        s.getTable().bindRows("/");
		        if (i.$().closest(".sapUiSizeCompact").length > 0) {
		            s.addStyleClass("sapUiSizeCompact");
		        }
		        s.open();
		        var o = new sap.ui.comp.filterbar.FilterBar({
		            advancedMode: true,
		            filterBarExpanded: false,
		            filterGroupItems: [
		                new sap.ui.comp.filterbar.FilterGroupItem({
		                    groupName: "SID",
		                    name: "S_ID",
		                    label: this.oResourceBundle.getText("SID"),
		                    control: new sap.m.Input()
		                }),
		                new sap.ui.comp.filterbar.FilterGroupItem({
		                    groupName: "SNAME",
		                    name: "S_NAME",
		                    label: this.oResourceBundle.getText("SNAME"),
		                    control: new sap.m.Input()
		                })
		            ],
		            search: function (e) {
		                var S = e.getParameters().selectionSet;
		                var d = s.theTable.getBinding("rows");
		                var g = [];
		                var A = true;
		                var h = {};
		                var j = [];
		                if (S[0].getValue() !== "") {
		                    var k = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, S[0].getValue());
		                    g.push(k);
		                    A = false;
		                }
		                if (S[1].getValue() !== "") {
		                    var l = new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, S[1].getValue());
		                    g.push(l);
		                    A = false;
		                }
		                if (sap.ui.getCore().byId("SupplierBasicSearch").getValue() !== "") {
		                    var k = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("SupplierBasicSearch").getValue());
		                    g.push(k);
		                    var l = new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("SupplierBasicSearch").getValue());
		                    g.push(l);
		                    A = false;
		                }
		                if (!A) {
		                    h = new sap.ui.model.Filter(g, false);
		                    j.push(h);
		                }
		                d.filter(j);
		            }
		        });
		        if (o.setBasicSearch) {
		            o.setBasicSearch(new sap.m.SearchField({
		                showSearchButton: sap.ui.Device.system.phone,
		                placeholder: "{i18n>SRCH}",
		                id: "SupplierBasicSearch",
		                search: function (e) {
		                    var d = e.getSource().getValue();
		                    if (d !== "") {
		                        var g = [];
		                        var h = {};
		                        var j = [];
		                        var k = s.theTable.getBinding("rows");
		                        var l = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, d);
		                        g.push(l);
		                        var m = new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, d);
		                        g.push(m);
		                        h = new sap.ui.model.Filter(g, false);
		                        j.push(h);
		                        k.filter(j);
		                    }
		                }
		            }));
		        }
		        s.setFilterBar(o);
		    },
		    getSupplierListFailure: function () {
		    },
		    handleSoSDialog: function (e) {
		        this.oEventSource = e.getSource();
		        this.SOSflag = false;
		        var m, p, q, P, A, c, d, v, b, M, g, h;
		        this.idSourceSOSFgt = e.getSource().getId();
		        if (e.getSource().getBindingContext() === undefined) {
		            m = e.getSource().getModel().getData().Material;
		            p = e.getSource().getModel().getData().Plant;
		            q = e.getSource().getModel().getData().Quantity;
		            P = e.getSource().getModel().getData().Purchasingdocumentitemcategory;
		            v = e.getSource().getModel().getData().Purchasingdocumenttype;
		            b = e.getSource().getModel().getData().Purchasingdocumentcategory;
		            A = e.getSource().getModel().getData().Acctassignmentcategory;
		            c = e.getSource().getModel().getData().Consumptionposting;
		            this.selectedPurReq = e.getSource().getModel().getData().Purchaserequisition;
		            this.selectedPurReqItem = e.getSource().getModel().getData().Purchaserequisitionitem;
		            this.selectedContract = e.getSource().getModel().getData().PurchaseContract;
		            this.selectedContractItem = e.getSource().getModel().getData().PurchaseContractItem;
		            this.selectedInforecord = e.getSource().getModel().getData().Purchasinginforecord;
		            M = e.getSource().getModel().getData().Materialgroup;
		            g = e.getSource().getModel().getData().Purchasingorganization;
		            h = e.getSource().getModel().getData().PurchasingDocumentSubType;
		            d = e.getSource().getModel().getData().DeliveryDate;
		            this.matkl_ana = e.getSource().getModel().getData().Materialgroup;
		            this.waers_ana = e.getSource().getModel().getData().PurReqnItemCurrency;
		        } else {
		            m = e.getSource().getModel().getProperty("Material", e.getSource().getBindingContext());
		            p = e.getSource().getModel().getProperty("Plant", e.getSource().getBindingContext());
		            q = e.getSource().getModel().getProperty("RequestedQuantity", e.getSource().getBindingContext());
		            P = e.getSource().getModel().getProperty("PurchasingDocumentItemCategory", e.getSource().getBindingContext());
		            v = e.getSource().getModel().getProperty("PurchaseRequisitionType", e.getSource().getBindingContext());
		            b = e.getSource().getModel().getProperty("PurchasingDocumentItemCategory", e.getSource().getBindingContext());
		            A = e.getSource().getModel().getProperty("AccountAssignmentCategory", e.getSource().getBindingContext());
		            c = e.getSource().getModel().getProperty("ConsumptionPosting", e.getSource().getBindingContext());
		            this.selectedPurReq = e.getSource().getModel().getProperty("PurchaseRequisition", e.getSource().getBindingContext());
		            this.selectedPurReqItem = e.getSource().getModel().getProperty("PurchaseRequisitionItem", e.getSource().getBindingContext());
		            this.selectedContract = e.getSource().getModel().getProperty("PurchaseContract", e.getSource().getBindingContext());
		            this.selectedContractItem = e.getSource().getModel().getProperty("PurchaseContractItem", e.getSource().getBindingContext());
		            this.selectedInforecord = e.getSource().getModel().getProperty("PurchasingInfoRecord", e.getSource().getBindingContext());
		            M = e.getSource().getModel().getProperty("MaterialGroup", e.getSource().getBindingContext());
		            g = e.getSource().getModel().getProperty("PurchasingOrganization", e.getSource().getBindingContext());
		            h = e.getSource().getModel().getProperty("PurchasingDocumentSubtype", e.getSource().getBindingContext());
		            d = e.getSource().getModel().getProperty("DeliveryDate", e.getSource().getBindingContext());
		            this.prItemBindingContext = e.getSource().getBindingContext();
		            this.matkl_ana = e.getSource().getModel().getProperty("MaterialGroup", e.getSource().getBindingContext());
		            this.waers_ana = e.getSource().getModel().getProperty("PurReqnItemCurrency", e.getSource().getBindingContext());
		        }
		        if (v === undefined) {
		            v = "";
		        }
		        if (b === undefined) {
		            b = "";
		        }
		        if (A === undefined) {
		            A = "";
		        }
		        if (h === undefined) {
		            h = "";
		        }
		        if (p === undefined) {
		            p = "";
		        }
		        if (g === undefined) {
		            g = "";
		        }
		        if (M === undefined) {
		            M = "";
		        }
		        if (m === undefined) {
		            m = "";
		        }
		        if (c === undefined) {
		            c = "";
		        }
		        var o = this.getModel();
		        if (q.split) {
		            var Q = q.split(".");
		        } else {
		            q = "'" + q + "'";
		            var Q = q.split(".");
		            this.openDialog("SoSDialog");
		        }
		        q = Q[0];
		        if (b === undefined) {
		            b = "";
		        }
		        if (v === undefined) {
		            v = "";
		        }
		        o.read("/SourceOfSupplySet", {
		            urlParameters: { "$filter": "BANFN eq '" + this.selectedPurReq + "' and BNFPO eq '" + this.selectedPurReqItem + "'" },
		            success: jQuery.proxy(this.sosReadSuccess, this),
		            error: jQuery.proxy(this.sosReadFailure, this)
		        });
		    },
		    sosReadSuccess: function (d, r) {
		        var I = -1;
		        for (var i = 0; i < d.results.length; i++) {
		            d.results[i].Supplier = d.results[i].LIFNR + ":" + d.results[i].NAME + ":" + d.results[i].INFNR + ":" + d.results[i].EBELN;
		            if (this.selectedContract !== "") {
		                if (this.selectedContract === d.results[i].EBELN && this.selectedContractItem === d.results[i].EBELP) {
		                    I = i;
		                }
		            }
		            if (this.selectedInforecord !== "") {
		                if (this.selectedInforecord === d.results[i].INFNR) {
		                    I = i;
		                }
		            }
		        }
		        var j = { "SourceOfSupplySet": d.results };
		        if (!this["SoSDialog"]) {
		            this["SoSDialog"] = sap.ui.xmlfragment("ui.ssuite.s2p.mm.pur.pr.prcss.s1.view.SosDialog", this);
		            this.getView().addDependent(this.SoSDialog);
		        }
		        this.sosShowContent(j, I);
		        this.openDialog("SoSDialog");
		    },
		    sosShowContent: function (d, i) {
		        var b = this.SoSDialog.getCustomHeader().getContent();
		        var t = b[3];
		        if (t.getPressed()) {
		            this.SoSDialog.getContent()[0].getItems()[0].setVisible(true);
		            this.SoSDialog.getContent()[0].getItems()[1].setVisible(true);
		            this.SoSDialog.getContent()[0].getItems()[2].setVisible(false);
		        } else {
		            this.SoSDialog.getContent()[0].getItems()[0].setVisible(false);
		            this.SoSDialog.getContent()[0].getItems()[1].setVisible(false);
		            this.SoSDialog.getContent()[0].getItems()[2].setVisible(true);
		        }
		        this.SourceOfSupplyData = d;
		        this.SoSDialog.setModel(new sap.ui.model.json.JSONModel(d));
		        var l = sap.ui.getCore().byId("idList");
		        if (i !== -1) {
		            l.getItems()[i].setSelected(true);
		        }
		    },
		    fillSOSDataSuccess: function (d) {
		        this.SOSflag = true;
		        var S = d.results;
		        var b = this.SourceOfSupplyData.SourceOfSupplySet;
		        for (var i = 0; i < S.length; i++) {
		            for (var j = 0; j < b.length; j++) {
		                if (b[j].LIFNR === S[i].LIFNR) {
		                    b[j].SCORE = S[i].SCORE;
		                }
		            }
		        }
		        var v = new sap.ui.model.json.JSONModel();
		        v.setData({ SourceOfSupplySet: b });
		        var V = new sap.viz.ui5.data.FlattenedDataset({
		            dimensions: [
		                {
		                    name: "Supplier",
		                    value: "{Supplier}"
		                },
		                {
		                    name: "CalendarMonth",
		                    value: "{CalendarMonth}"
		                }
		            ],
		            measures: [
		                {
		                    name: "Score",
		                    value: "{Score}"
		                },
		                {
		                    name: "NETPR",
		                    value: "{NETPR}"
		                },
		                {
		                    name: "TotalSpend",
		                    value: "{TotalSpend}"
		                }
		            ],
		            data: { path: "/SourceOfSupplySet" }
		        });
		        this.SoSDialog.getContent()[0].getItems()[2].setModel(v);
		        this.SoSDialog.getContent()[0].getItems()[2].setDataset(V);
		        var C = this.getView().getModel("i18n").getProperty("PerUnitPrice");
		        var c = this.getView().getModel("i18n").getProperty("SupplierScore");
		        var l = this.getView().getModel("i18n").getProperty("SOS");
		        var s = this.getView().getModel("i18n").getProperty("TotalSpend");
		        this.SoSDialog.getContent()[0].getItems()[2].setVizProperties({
		            valueAxis: {
		                title: {
		                    text: c,
		                    visible: true
		                }
		            },
		            valueAxis2: {
		                title: {
		                    text: C,
		                    visible: true
		                }
		            },
		            legend: {
		                title: {
		                    text: l,
		                    visible: true
		                }
		            },
		            sizeLegend: {
		                title: {
		                    text: s,
		                    visible: true
		                }
		            },
		            plotArea: {
		                dataLabel: {
		                    visible: true,
		                    hideWhenOverlap: false,
		                    respectShapeWidth: true
		                }
		            }
		        });
		    },
		    fillSOSDataFailure: function (d) {
		        this.SOSflag = false;
		    },
		    onPressSwitchTable: function (e) {
		        this.SoSDialog.getContent()[0].getItems()[0].setVisible(true);
		        this.SoSDialog.getContent()[0].getItems()[1].setVisible(true);
		        this.SoSDialog.getContent()[0].getItems()[2].setVisible(false);
		        this.SoSDialog.getCustomHeader().getContent()[3].setPressed(true);
		        this.SoSDialog.getCustomHeader().getContent()[4].setPressed(false);
		        this.SoSDialog.getCustomHeader().getContent()[5].setVisible(false);
		    },
		    onPressSwitchChart: function (e) {
		        this.SoSDialog.getContent()[0].getItems()[0].setVisible(false);
		        this.SoSDialog.getContent()[0].getItems()[1].setVisible(false);
		        this.SoSDialog.getContent()[0].getItems()[2].setVisible(true);
		        this.SoSDialog.getCustomHeader().getContent()[3].setPressed(false);
		        this.SoSDialog.getCustomHeader().getContent()[4].setPressed(true);
		        this.SoSDialog.getCustomHeader().getContent()[5].setVisible(false);
		        this.ScoreRequested = "X";
		        var b = "BANFN eq '" + this.selectedPurReq + "' and BNFPO eq '" + this.selectedPurReqItem + "' and MATKL eq '" + this.matkl_ana + "' and WAERS eq '" + this.waers_ana + "' and ScoreRequested eq '" + this.ScoreRequested + "'";
		        if (this.SOSflag === false) {
		            this.getModel().read("/SourceOfSupplySet", {
		                urlParameters: {
		                    "$filter": b,
		                    "$select": "LIFNR,Score"
		                },
		                success: jQuery.proxy(this.fillSOSDataSuccess, this),
		                error: jQuery.proxy(this.fillSOSDataFailure, this)
		            });
		        }
		    },
		    onPressLegendEnable: function (e) {
		        var l = e.getSource();
		        if (l.getPressed()) {
		            this.SoSDialog.getContent()[0].getItems()[2].setLegendVisible(true);
		        } else {
		            this.SoSDialog.getContent()[0].getItems()[2].setLegendVisible(false);
		        }
		    },
		    onTableSelect: function (e) {
		        var s = e.getSource().getSelectedItem().getBindingContext().getObject();
		        this.onSosConfirm(s);
		        this.SoSDialog.close();
		    },
		    onChartSelect: function (e) {
		        var s = e.getParameters().data[0].data;
		        var S = {};
		        var b = this.SourceOfSupplyData.SourceOfSupplySet;
		        var c = s.Supplier.split(":");
		        for (var i = 0; i < b.length; i++) {
		            if (b[i].LIFNR === c[0] && (b[i].EBELN === c[2] || b[i].INFNR === c[2])) {
		                S = b[i];
		                break;
		            }
		        }
		        this.onSosConfirm(S);
		        this.SoSDialog.close();
		    },
		    handleClose: function () {
		        this.SOSflag = false;
		        this.SoSDialog.getContent()[0].getItems()[0].setVisible(true);
		        this.SoSDialog.getContent()[0].getItems()[1].setVisible(true);
		        this.SoSDialog.getContent()[0].getItems()[2].setVisible(false);
		        this.SoSDialog.getCustomHeader().getContent()[3].setPressed(true);
		        this.SoSDialog.getCustomHeader().getContent()[4].setPressed(false);
		        this.SoSDialog.getCustomHeader().getContent()[5].setVisible(false);
		        var s = sap.ui.getCore().byId("idSoSSearch");
		        s.setValue("");
		        this.SoSDialog.close();
		    },
		    sosReadFailure: function () {
		    },
		    onSoSSearch: function (e) {
		        var b = [];
		        var q = e.getParameter("query");
		        if (q && q.length > 0) {
		            var c = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, q);
		            b.push(c);
		        }
		        var l = sap.ui.getCore().byId("idList");
		        var d = l.getBinding("items");
		        d.filter(b, "Application");
		    },
		    onSosConfirm: function (s) {
		        var v = s.LIFNR;
		        var i = s.INFNR;
		        var c = s.WAERS;
		        var C = s.EBELN;
		        var S = s.VRTYP;
		        var b = s.EBELP;
		        var d = s.BSART;
		        var p = s.EKORG;
		        if (this["editDialog"]) {
		            var m = this["editDialog"].getModel();
		        }
		        var P = {};
		        if (this.idSourceSOSFgt === "linkSOSEditFgt") {
		            m.getData().Fixedvendor = v;
		            m.getData().Purchasinginforecord = i;
		            m.getData().Purgdoctransactioncurrency = c;
		            m.getData().PurchaseContract = C;
		            m.getData().PurchaseContractItem = b;
		            m.getData().RequisitionSourceOfSupplyType = S;
		            m.getData().Purchasingorganization = p;
		            m.getData().FixedVendorSet = true;
		            m.getData().Supplier = "";
		            this["editDialog"].setModel(m);
		            m.refresh();
		        } else {
		            var e = this.getModel();
		            P.RequestedQuantity = e.getProperty("RequestedQuantity", this.prItemBindingContext);
		            P.BaseUnit = e.getProperty("BaseUnit", this.prItemBindingContext);
		            P.DeliveryDate = e.getProperty("DeliveryDate", this.prItemBindingContext);
		            P.PurchaseRequisitionItemText = e.getProperty("PurchaseRequisitionItemText", this.prItemBindingContext);
		            P.Material = e.getProperty("Material", this.prItemBindingContext);
		            P.Plant = e.getProperty("Plant", this.prItemBindingContext);
		            P.PurchasingDocumentItemCategory = e.getProperty("PurchasingDocumentItemCategory", this.prItemBindingContext);
		            P.MaterialGroup = e.getProperty("MaterialGroup", this.prItemBindingContext);
		            P.PurchasingOrganization = e.getProperty("PurchasingOrganization", this.prItemBindingContext);
		            if (d === "RV") {
		                P.PurchaseRequisition = this.selectedPurReq;
		                P.PurchaseRequisitionItem = this.selectedPurReqItem;
		                P.FixedSupplier = "";
		                P.PurchasingInfoRecord = "";
		                P.PurReqnItemCurrency = c;
		                P.PurchaseContract = "";
		                P.PurchaseContractItem = "";
		                P.PurReqnSourceOfSupplyType = "";
		                P.Supplier = v;
		            } else {
		                P.PurchaseRequisition = this.selectedPurReq;
		                P.PurchaseRequisitionItem = this.selectedPurReqItem;
		                P.FixedSupplier = v;
		                P.PurchasingInfoRecord = i;
		                P.PurchasingOrganization = p;
		                P.PurReqnItemCurrency = c;
		                P.PurchaseContract = C;
		                P.PurchaseContractItem = b;
		                P.PurReqnSourceOfSupplyType = S;
		                P.Supplier = "";
		            }
		            var g = sap.ui.getCore().getMessageManager();
		            g.removeAllMessages();
		            var u = "/C_Purchasereqitmdtlsext(PurchaseRequisition='" + P.PurchaseRequisition + "',PurchaseRequisitionItem='" + P.PurchaseRequisitionItem + "')";
		            var M = this.getModel();
		            M.setRefreshAfterChange(false);
		            if (P.tempSupplier !== undefined || P.tempSupplier !== null) {
		                delete P.tempSupplier;
		            }
		            M.update(u, P, {
		                success: jQuery.proxy(this.sosUpdtSuccessHdlr, this),
		                error: jQuery.proxy(this.sosUpdtErrorHdlr, this)
		            });
		        }
		    },
		    sosUpdtSuccessHdlr: function (d, r) {
		        this.CreateButtonsEnableCheckPostUpdate();
		        var e = new Array();
		        var m;
		        var n = false;
		        var i = true;
		        var E;
		        if (r && r.headers["sap-message"]) {
		            var b = JSON.parse(r.headers["sap-message"]).details;
		            var c = JSON.parse(r.headers["sap-message"]);
		            var g = {
		                name: c.message,
		                state: this._getMessageState(c.severity),
		                icon: this._getMessageIcon(c.severity)
		            };
		            e.push(g);
		            for (var M = 0; M < b.length; M++) {
		                E = {
		                    name: b[M].message,
		                    state: this._getMessageState(b[M].severity),
		                    icon: this._getMessageIcon(b[M].severity)
		                };
		                e.push(E);
		            }
		        }
		        if (e.length > 0) {
		            m = this._getMessagePopup(e, n, i);
		            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), m);
		            m.open();
		        } else {
		            sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("SoSSucsess"));
		        }
		        this.getModel().refresh();
		    },
		    sosUpdtErrorHdlr: function (d, r) {
		        var e = "";
		        sap.m.MessageBox.error(e);
		    },
		    CreateButtonsEnableCheckPostUpdate: function () {
		        var s = this.byId("idPRItemTable").getSelectedContexts();
		        var i, d, e, E, b;
		        if (s.length === 0) {
		            e = false;
		            E = false;
		            b = false;
		        } else {
		            for (i = 0; i < s.length; i++) {
		                d = s[i].getProperty(s[i].getPath());
		                if ((d.FixedSupplier === null || d.FixedSupplier === undefined || d.FixedSupplier === "") && (d.Supplier === null || d.Supplier === undefined || d.Supplier === "")) {
		                    e = false;
		                    break;
		                } else if (d.OrderedQuantity >= d.RequestedQuantity) {
		                    e = false;
		                    E = false;
		                    b = false;
		                    break;
		                } else {
		                    e = true;
		                    b = true;
		                    if (this.RFQFlag === true) {
		                        E = true;
		                    }
		                }
		            }
		        }
		        this.byId("CreatePO").setEnabled(e);
		        this.byId("CreateRFQ").setEnabled(E);
		        this.byId("CreateCTR").setEnabled(b);
		    },
		    onDialogOkButton: function (e) {
		        e.getSource().focus();
		        var m = this.getModel();
		        m.setRefreshAfterChange(false);
		        var p = e.getSource().getModel().getData();
		        var u = sap.ui.getCore().byId("supplierF4multiInput").getValue();
		        if (e.getSource().getModel().getData().tempSupplier) {
		            e.getSource().getModel().getData().Supplier = e.getSource().getModel().getData().tempSupplier;
		            delete e.getSource().getModel().getData().tempSupplier;
		            e.getSource().getModel().getData().Fixedvendor = "";
		            e.getSource().getModel().getData().Purchasinginforecord = "";
		            e.getSource().getModel().getData().PurchaseContract = "";
		            e.getSource().getModel().getData().PurchaseContractItem = "";
		            e.getSource().getModel().getData().RequisitionSourceOfSupplyType = "";
		        }
		        if ((p.Deliverydate === "" || p.Deliverydate === undefined || p.Deliverydate === null) && (this.bDateChanged != true && (this.deliverydate != "" || this.deliverydate != undefined || this.deliverydate != null)) && e.getSource().getModel().getData().PurchasingDocumentItemCategory !== "A") {
		            this.oResourceBundle = this.getResourceBundle();
		            var b = this.oResourceBundle.getText("EditMessage");
		            sap.m.MessageBox.error(b);
		        } else if (p.Quantity === "" || p.Quantity === "NaN" || p.Quantity === undefined || p.Quantity < 0 || p.Quantity === 0 || p.Quantity === "0" && e.getSource().getModel().getData().PurchasingDocumentItemCategory !== "A") {
		            this.oResourceBundle = this.getResourceBundle();
		            var c = this.oResourceBundle.getText("MandatoryQuantity");
		            sap.m.MessageBox.error(c);
		        } else {
		            if (this.bDateChanged) {
		                this._iEvent = 0;
		                var d = new Date(this.deliverydate);
		                d.setDate(d.getDate() + 1);
		                p.Deliverydate = d;
		            }
		            if (this.bEndDateChanged) {
		                this._iEvent = 0;
		                var E = new Date(this.EndDate);
		                E.setDate(E.getDate() + 1);
		                p.PerformancePeriodEndDate = E;
		            }
		            if (this.bStartDateChanged) {
		                this._iEvent = 0;
		                var s = new Date(this.StartDate);
		                s.setDate(s.getDate() + 1);
		                p.PerformancePeriodStartDate = s;
		            }
		            if (!p.FixedVendorSet) {
		                if (u === "Supplier") {
		                    p.Fixedvendor = "";
		                    p.Supplier = "";
		                } else {
		                    p.Fixedvendor = u;
		                }
		            }
		            if (p.FixedVendorSet) {
		                delete p.FixedVendorSet;
		            }
		            var g = sap.ui.getCore().getMessageManager();
		            g.removeAllMessages();
		            var U = "/C_Purchasereqitmdtlsext(PurchaseRequisition='" + p.Purchaserequisition + "',PurchaseRequisitionItem='" + p.Purchaserequisitionitem + "')";
		            if (p.tempSupplier !== undefined || p.tempSupplier !== null) {
		                delete p.tempSupplier;
		            }
		            var P = {};
		            P.PurchaseRequisition = p.Purchaserequisition;
		            P.PurchaseRequisitionItem = p.Purchaserequisitionitem;
		            P.RequestedQuantity = p.Quantity;
		            P.BaseUnit = p.Materialbaseunit;
		            P.DeliveryDate = p.Deliverydate;
		            P.PurchaseRequisitionItemText = p.Purchaserequisitionitemtext;
		            P.PerformancePeriodEndDate = p.PerformancePeriodEndDate;
		            P.PerformancePeriodStartDate = p.PerformancePeriodStartDate;
		            P.Material = p.Material;
		            P.Plant = p.Plant;
		            P.FixedSupplier = p.Fixedvendor;
		            P.PurchasingInfoRecord = p.Purchasinginforecord;
		            P.PurReqnItemCurrency = p.Purgdoctransactioncurrency;
		            P.PurchaseRequisitionPrice = p.Materialcomponentprice;
		            P.PurchasingDocumentItemCategory = p.Purchasingdocumentitemcategory;
		            P.PurchaseContract = p.PurchaseContract;
		            P.PurchaseContractItem = p.PurchaseContractItem;
		            P.PurReqnSourceOfSupplyType = p.RequisitionSourceOfSupplyType;
		            P.AccountAssignmentCategory = p.Acctassignmentcategory;
		            P.ConsumptionPosting = p.Consumptionposting;
		            P.MaterialGroup = p.Materialgroup;
		            P.PurchasingOrganization = p.Purchasingorganization;
		            m.update(U, P, {
		                success: jQuery.proxy(this.UpdtSuccessHdlr, this),
		                error: jQuery.proxy(this.UpdtErrorHdlr, this)
		            });
		            e.getSource().getParent().close();
		        }
		        this.bDateChanged = false;
		        this.bEndDateChanged = false;
		        this.bStartDateChanged = false;
		    },
		    UpdtSuccessHdlr: function (r) {
		        this.CreateButtonsEnableCheckPostUpdate();
		        var e = new Array();
		        var m;
		        var n = false;
		        var i = true;
		        var E;
		        if (r && r.headers["sap-message"]) {
		            var b = JSON.parse(r.headers["sap-message"]).details;
		            var c = JSON.parse(r.headers["sap-message"]);
		            var d = {
		                name: c.message,
		                state: this._getMessageState(c.severity),
		                icon: this._getMessageIcon(c.severity)
		            };
		            e.push(d);
		            for (var M = 0; M < b.length; M++) {
		                E = {
		                    name: b[M].message,
		                    state: this._getMessageState(b[M].severity),
		                    icon: this._getMessageIcon(b[M].severity)
		                };
		                e.push(E);
		            }
		        } else {
		            var g = sap.ui.getCore().getMessageManager();
		            var h = g.getMessageModel().getData();
		            for (var j = 0; j < h.length; j++) {
		                E = {
		                    name: h[j].message,
		                    state: this._getMessageState(h[j].type),
		                    icon: this._getMessageIcon(h[j].type)
		                };
		                e.push(E);
		            }
		        }
		        if (e.length > 0) {
		            m = this._getMessagePopup(e, n, i);
		            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), m);
		            m.open();
		        }
		        this.getModel().refresh();
		    },
		    UpdtErrorHdlr: function (r) {
		        var e = "";
		    }
	});
});
