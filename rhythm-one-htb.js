/**
 * @author:    Partner
 * @license:   UNLICENSED
 *
 * @copyright: Copyright (c) 2017 by Index Exchange. All rights reserved.
 *
 * The information contained within this document is confidential, copyrighted
 * and or a trade secret. No part of this document may be reproduced or
 * distributed in any form or by any means, in whole or in part, without the
 * prior written permission of Index Exchange.
 */

'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var BidTransformer = require('bid-transformer.js');
var Browser = require('browser.js');
var Classify = require('classify.js');
var Constants = require('constants.js');
var Partner = require('partner.js');
var Size = require('size.js');
var SpaceCamp = require('space-camp.js');
var System = require('system.js');
var Utilities = require('utilities.js');
var Whoopsie = require('whoopsie.js');
var EventsService;
var RenderService;

//? if (DEBUG) {
var ConfigValidators = require('config-validators.js');
var PartnerSpecificValidator = require('rhythm-one-htb-validator.js');
var Scribe = require('scribe.js');
//? }

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Partner module template
 *
 * @class
 */
function RhythmOneHtb(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Reference to the partner base class.
     *
     * @private {object}
     */
    var __baseClass;

    /**
     * Profile for this partner.
     *
     * @private {object}
     */
    var __profile;

    /**
     * Instances of BidTransformer for transforming bids.
     *
     * @private {object}
     */
    var __bidTransformers;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */
     
    var configuredPlacements,
        loadStart,
        version = "0.5",
        global = window;
     
    /**
     * Generates the request URL and query data to the endpoint for the xSlots
     * in the given returnParcels.
     *
     * @param  {object[]} returnParcels
     *
     * @return {object}
     */
    function __generateRequestObj(returnParcels) {
        var queryObj = {};
        var baseUrl = Browser.getProtocol() + '';
        var callbackId = System.generateUniqueId();

        /* =============================================================================
         * STEP 2  | Generate Request URL
         * -----------------------------------------------------------------------------
         *
         * Generate the URL to request demand from the partner endpoint using the provided
         * returnParcels. The returnParcels is an array of objects each object containing
         * an .xSlotRef which is a reference to the xSlot object from the partner configuration.
         * Use this to retrieve the placements/xSlots you need to request for.
         *
         * If your partner is MRA, returnParcels will be an array of length one. If your
         * partner is SRA, it will contain any number of entities. In any event, the full
         * contents of the array should be able to fit into a single request and the
         * return value of this function should similarly represent a single request to the
         * endpoint.
         *
         * Return an object containing:
         * queryUrl: the url for the request
         * data: the query object containing a map of the query string paramaters
         *
         * callbackId:
         *
         * arbitrary id to match the request with the response in the callback function. If
         * your endpoint supports passing in an arbitrary ID and returning as part of the response
         * please use the callbackType: Partner.CallbackTypes.ID and fill out the adResponseCallback.
         * Also please provide this adResponseCallback to your bid request here so that the JSONP
         * response calls it once it has completed.
         *
         * If your endpoint does not support passing in an ID, simply use
         * Partner.CallbackTypes.CALLBACK_NAME and the wrapper will take care of handling request
         * matching by generating unique callbacks for each request using the callbackId.
         *
         * If your endpoint is ajax only, please set the appropriate values in your profile for this,
         * i.e. Partner.CallbackTypes.NONE and Partner.Requesttypes.AJAX
         *
         * The return object should look something like this:
         * {
         *     url: 'http://bidserver.com/api/bids' // base request url for a GET/POST request
         *     data: { // query string object that will be attached to the base url
         *        slots: [
         *             {
         *                 placementId: 54321,
         *                 sizes: [[300, 250]]
         *             },{
         *                 placementId: 12345,
         *                 sizes: [[300, 600]]
         *             },{
         *                 placementId: 654321,
         *                 sizes: [[728, 90]]
         *             }
         *         ],
         *         site: 'http://google.com'
         *     },
         *     callbackId: '_23sd2ij4i1' //unique id used for pairing requests and responses
         * }
         */

        /* PUT CODE HERE */

        /* -------------------------------------------------------------------------- */

        var demand = {slot:{}},
            bids = [],
            i=0;
        
        /*
        var returnParcels = [{
                partnerId: 'RhythmOneHtb',
                htSlot: { getId: function () {
                    return "htSlot1"
                }},
                ref: '',
                xSlotRef: { placementId: '54321', sizes: [ [300,250] ] },
                requestId: '_1496788873668',
            },{
                partnerId: 'RhythmOneHtb',
                htSlot: { getId: function () {
                    return "htSlot1"
                }},
                ref: '',
                xSlotRef: { placementId: '12345', sizes: [ [300,600] ] },
                requestId: '_1496788873668',
            },{
                partnerId: 'RhythmOneHtb',
                htSlot: { getId: function () {
                    return "htSlot2"
                }},
                ref: '',
                xSlotRef: { placementId: '654321', sizes: [ [728,90] ] },
                requestId: '_1496788873668',
            }];
        */
        
        for(; i<returnParcels.length; i++){
            if(returnParcels[i].partnerId === "RhythmOneHtb"){
                var id = System.generateUniqueId(16, "ALPHANUM"),
                    slotData = returnParcels[i].xSlotRef,
                    bid = {
                        placementCode: id+"_"+returnParcels[i].htSlot.getId(),
                        sizes: []
                    };

                bidParams.placementId = slotData.placementId;
                
                if(slotData.zone) bidParams.zone = slotData.zone;
                if(slotData.path) bidParams.path = slotData.path;
                if(slotData.endpoint) bidParams.endpoint = slotData.endpoint;

                for(var j=0; j<slotData.sizes.length; j++)
                    bid.sizes.push([slotData.sizes[j][0],slotData.sizes[j][1]]);
                
                bids.push(bid);
            }
        }

        var url = applyMacros(bidParams.endpoint || "http"+((/^https\:/i).test(document.location.href)?"s":"")+"://tag.1rx.io/rmp/{placementId}/0/{path}", {
                placementid:bidParams.placementId,
                zone: bidParams.zone || "1r",
                path: bidParams.path || "mvo"
            }),
            query = {
                trace: (bidParams.trace === true),
                debug: (bidParams.debug === true)
            };

        function p(k,v){
            if(v instanceof Array)
                v = v.join(",");
            if(typeof v !== "undefined")
                query[encodeURIComponent(k)] = encodeURIComponent(v);
        }

        p("domain", attempt(function(){
            var d = global.document.location.ancestorOrigins;
            if(d && d.length > 0)
            return d[d.length-1];
            return global.top.document.location.hostname; // try/catch is in the attempt function
        },""));
        p("title", attempt(function(){return global.top.document.title;},"")); // try/catch is in the attempt function
        p("url", attempt(function(){
            var l;
            try{l = global.top.document.location.href.toString();} // try/catch is in the attempt function
            catch(ex){l = global.document.location.href.toString();}
            return l;
        },""));
        p("dsh", (global.screen ? global.screen.height : ""));
        p("dsw", (global.screen ? global.screen.width : ""));
        p("tz", (new Date()).getTimezoneOffset());
        p("dtype", ((/(ios|ipod|ipad|iphone|android)/i).test(global.navigator.userAgent) ? 1 : ((/(smart[-]?tv|hbbtv|appletv|googletv|hdmi|netcast\.tv|viera|nettv|roku|\bdtv\b|sonydtv|inettvbrowser|\btv\b)/i).test(global.navigator.userAgent) ? 3 : 2)));
        p("flash", (flashInstalled() ? 1 : 0));

        var heights = [],
            widths = [],
            floors = [],
            mediaTypes = [];
            
        configuredPlacements = [];

        p("hbv", "IX,"+version);

        for(i=0; i<bids.length; i++){

            var th = [], tw = [];

            if(bids[i].sizes.length > 0 && typeof bids[i].sizes[0] === "number")
                bids[i].sizes = [bids[i].sizes];

            for(var j = 0; j<bids[i].sizes.length; j++){
                tw.push(bids[i].sizes[j][0]);
                th.push(bids[i].sizes[j][1]);
            }
            configuredPlacements.push(bids[i].placementCode);
            heights.push(th.join("|"));
            widths.push(tw.join("|"));
            mediaTypes.push(((/video/i).test(bids[i].mediaType) ? "v" : "d"));
            floors.push(0);
        }

        p("imp", configuredPlacements);
        p("w", widths);
        p("h", heights);
        p("floor", floors);
        p("t", mediaTypes);
        
        loadStart = (new Date()).getTime();
        
        return {
            url: url,
            data: query,
            callbackId: callbackId
        };
    }

    /* =============================================================================
     * STEP 3  | Response callback
     * -----------------------------------------------------------------------------
     *
     * This generator is only necessary if the partner's endpoint has the ability
     * to return an arbitrary ID that is sent to it. It should retrieve that ID from
     * the response and save the response to adResponseStore keyed by that ID.
     *
     * If the endpoint does not have an appropriate field for this, set the profile's
     * callback type to CallbackTypes.CALLBACK_NAME and omit this function.
     */
    function adResponseCallback(adResponse) {
        /* get callbackId from adResponse here */
        var callbackId = 0;
        __baseClass._adResponseStore[callbackId] = adResponse;
    }
    /* -------------------------------------------------------------------------- */

    /* Helpers
     * ---------------------------------- */

    /* =============================================================================
     * STEP 5  | Rendering
     * -----------------------------------------------------------------------------
     *
     * This function will render the ad given. Usually need not be changed unless
     * special render functionality is needed.
     *
     * @param  {Object} doc The document of the iframe where the ad will go.
     * @param  {string} adm The ad code that came with the original demand.
     */
    function __render(doc, adm) {
        System.documentWrite(doc, adm);
    }

    /**
     * Parses and extracts demand from adResponse according to the adapter and then attaches it
     * to the corresponding bid's returnParcel in the correct format using targeting keys.
     *
     * @param {string} sessionId The sessionId, used for stats and other events.
     *
     * @param {any} adResponse This is the adresponse as returned from the bid request, that was either
     * passed to a JSONP callback or simply sent back via AJAX.
     *
     * @param {object[]} returnParcels The array of original parcels, SAME array that was passed to
     * generateRequestObj to signal which slots need demand. In this funciton, the demand needs to be
     * attached to each one of the objects for which the demand was originally requested for.
     */
    function __parseResponse(sessionId, adResponse, returnParcels) {

        var unusedReturnParcels = returnParcels.slice();

        /* =============================================================================
         * STEP 4  | Parse & store demand response
         * -----------------------------------------------------------------------------
         *
         * Fill the below variables with information about the bid from the partner, using
         * the adResponse variable that contains your module adResponse.
         */

        /* This an array of all the bids in your response that will be iterated over below. Each of
         * these will be mapped back to a returnParcel object using some criteria explained below.
         * The following variables will also be parsed and attached to that returnParcel object as
         * returned demand.
         *
         * Use the adResponse variable to extract your bid information and insert it into the
         * bids array. Each element in the bids array should represent a single bid and should
         * match up to a single element from the returnParcel array.
         *
         */

        /* ---------- Proces adResponse and extract the bids into the bids array ------------*/

        if(typeof adResponse === "string")
            adResponse = JSON.parse(adResponse);
        
        var bids = [];
        
        for(var i=0; adResponse.seatbid && i<adResponse.seatbid.length; i++){
            for(var k=0; adResponse.seatbid[i].bid && k<adResponse.seatbid[i].bid.length; k++){
                bids.push(adResponse.seatbid[i].bid[k]);
            }
        }

        /* --------------------------------------------------------------------------------- */

        for (var i = 0; i < bids.length; i++) {

            var curReturnParcel;

            for (var j = unusedReturnParcels.length - 1; j >= 0; j--) {

                /**
                 * This section maps internal returnParcels and demand returned from the bid request.
                 * In order to match them correctly, they must be matched via some criteria. This
                 * is usually some sort of placements or inventory codes. Please replace the someCriteria
                 * key to a key that represents the placement in the configuration and in the bid responses.
                 */

                if (unusedReturnParcels[j].htSlot.getId() === bids[i].impid.split("_")[1]) {
                    curReturnParcel = unusedReturnParcels[j];
                    unusedReturnParcels.splice(j, 1);
                    break;
                }
            }

            if (!curReturnParcel) {
                continue;
            }

            /* ---------- Fill the bid variables with data from the bid response here. ------------*/

            var bidPrice = bids[i].price; // the bid price for the given slot
            var bidWidth = bids[i].w; // the width of the given slot
            var bidHeight =  = bids[i].h ; // the height of the given slot
            var bidCreative = bids[i].adm; // the creative/adm for the given slot that will be rendered if is the winner.
            var bidDealId; // the dealId if applicable for this slot.
            var bidIsPass; // true/false value for if the module returned a pass for this slot.

            /* ---------------------------------------------------------------------------------------*/

            if (bidIsPass) {
                //? if (DEBUG) {
                Scribe.info(__profile.partnerId + ' returned pass for { id: ' + adResponse.id + ' }.');
                //? }
                if (__profile.enabledAnalytics.requestTime) {
                    EventsService.emit('hs_slot_pass', {
                        sessionId: sessionId,
                        statsId: __profile.statsId,
                        htSlotId: curReturnParcel.htSlot.getId(),
                        xSlotNames: [curReturnParcel.xSlotName]
                    });
                }

                curReturnParcel.pass = true;

                continue;
            }

            if (__profile.enabledAnalytics.requestTime) {
                EventsService.emit('hs_slot_bid', {
                    sessionId: sessionId,
                    statsId: __profile.statsId,
                    htSlotId: curReturnParcel.htSlot.getId(),
                    xSlotNames: [curReturnParcel.xSlotName]
                });
            }

            curReturnParcel.size = [bidWidth, bidHeight];
            curReturnParcel.targetingType = 'slot';
            curReturnParcel.targeting = {};

            //? if (FEATURES.GPT_LINE_ITEMS) {
            var targetingCpm = __bidTransformers.targeting.apply(bidPrice);
            var sizeKey = Size.arrayToString(curReturnParcel.size);

            if (bidDealId !== '') {
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.pmid] = [sizeKey + '_' + bidDealId];
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.pm] = [sizeKey + '_' + targetingCpm];
            } else {
                curReturnParcel.targeting[__baseClass._configs.targetingKeys.om] = [sizeKey + '_' + targetingCpm];
            }
            curReturnParcel.targeting[__baseClass._configs.targetingKeys.id] = [curReturnParcel.requestId];

            if (__baseClass._configs.lineItemType === Constants.LineItemTypes.ID_AND_SIZE) {
                RenderService.registerAdByIdAndSize(
                    sessionId,
                    __profile.partnerId,
                    __render, [bidCreative],
                    '',
                    __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0,
                    curReturnParcel.requestId, [bidWidth, bidHeight]
                );
            } else if (__baseClass._configs.lineItemType === Constants.LineItemTypes.ID_AND_PRICE) {
                RenderService.registerAdByIdAndPrice(
                    sessionId,
                    __profile.partnerId,
                    __render, [bidCreative],
                    '',
                    __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0,
                    curReturnParcel.requestId,
                    targetingCpm
                );
            }
            //? }

            //? if (FEATURES.RETURN_CREATIVE) {
            curReturnParcel.adm = bidCreative;
            //? }

            //? if (FEATURES.RETURN_PRICE) {
            curReturnParcel.price = Number(__bidTransformers.price.apply(bidPrice));
            //? }

            //? if (FEATURES.INTERNAL_RENDER) {
            var pubKitAdId = RenderService.registerAd(
                sessionId,
                __profile.partnerId,
                __render, [bidCreative],
                '',
                __profile.features.demandExpiry.enabled ? (__profile.features.demandExpiry.value + System.now()) : 0
            );
            curReturnParcel.targeting.pubKitAdId = pubKitAdId;
            //? }
        }

    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;

        /* =============================================================================
         * STEP 1  | Partner Configuration
         * -----------------------------------------------------------------------------
         *
         * Please fill out the below partner profile according to the steps in the README doc.
         */

        /* ---------- Please fill out this partner profile according to your module ------------*/
        __profile = {
            partnerId: 'RhythmOneHtb', // PartnerName
            namespace: 'RhythmOneHtb', // Should be same as partnerName
            statsId: 'RONE', // Three character unique partner identifier
            version: '2.0.0',
            targetingType: 'slot',
            enabledAnalytics: {
                requestTime: true
            },
            features: {
                demandExpiry: {
                    enabled: false,
                    value: 0
                },
                rateLimiting: {
                    enabled: false,
                    value: 0
                }
            },
            targetingKeys: { // Targeting keys for demand, should follow format ix_{statsId}_id
                id: 'ix_rone_id',
                om: 'ix_rone_cpm',
                pm: 'ix_rone_cpm',
                pmid: 'ix_rone_pmid'
            },
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.NONE, // Callback type, please refer to the readme for details
            architecture: Partner.Architectures.SRA, // Request architecture, please refer to the readme for details
            requestType: Partner.RequestTypes.ANY // Request type, jsonp, ajax, or any.
        };
        /* ---------------------------------------------------------------------------------------*/

        //? if (DEBUG) {
        var results = ConfigValidators.partnerBaseConfig(configs) || PartnerSpecificValidator(configs);

        if (results) {
            throw Whoopsie('INVALID_CONFIG', results);
        }
        //? }

        /*
         * Adjust the below bidTransformerConfigs variable to match the units the adapter
         * sends bids in and to match line item setup. This configuration variable will
         * be used to transform the bids going into DFP.
         */

        /* - Please fill out this bid trasnformer according to your module's bid response format - */
        var bidTransformerConfigs = {
            //? if (FEATURES.GPT_LINE_ITEMS) {
            targeting: {
                inputCentsMultiplier: 1, // Input is in cents
                outputCentsDivisor: 1, // Output as cents
                outputPrecision: 0, // With 0 decimal places
                roundingType: 'FLOOR', // jshint ignore:line
                floor: 0,
                buckets: [{
                    max: 2000, // Up to 20 dollar (above 5 cents)
                    step: 5 // use 5 cent increments
                }, {
                    max: 5000, // Up to 50 dollars (above 20 dollars)
                    step: 100 // use 1 dollar increments
                }]
            },
            //? }
            //? if (FEATURES.RETURN_PRICE) {
            price: {
                inputCentsMultiplier: 1, // Input is in cents
                outputCentsDivisor: 1, // Output as cents
                outputPrecision: 0, // With 0 decimal places
                roundingType: 'NONE',
            },
            //? }
        };

        /* --------------------------------------------------------------------------------------- */

        if (configs.bidTransformer) {
            //? if (FEATURES.GPT_LINE_ITEMS) {
            bidTransformerConfigs.targeting = configs.bidTransformer;
            //? }
            //? if (FEATURES.RETURN_PRICE) {
            bidTransformerConfigs.price.inputCentsMultiplier = configs.bidTransformer.inputCentsMultiplier;
            //? }
        }

        __bidTransformers = {};

        //? if (FEATURES.GPT_LINE_ITEMS) {
        __bidTransformers.targeting = BidTransformer(bidTransformerConfigs.targeting);
        //? }
        //? if (FEATURES.RETURN_PRICE) {
        __bidTransformers.price = BidTransformer(bidTransformerConfigs.price);
        //? }

        __baseClass = Partner(__profile, configs, null, {
            parseResponse: __parseResponse,
            generateRequestObj: __generateRequestObj,
            adResponseCallback: adResponseCallback
        });
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'RhythmOneHtb',
        //? }

        //? if (TEST) {
        __baseClass: __baseClass,
        //? }

        /* Data
         * ---------------------------------- */

        //? if (TEST) {
        profile: __profile,
        //? }

        /* Functions
         * ---------------------------------- */

        //? if (TEST) {
        render: __render,
        parseResponse: __parseResponse,
        generateRequestObj: __generateRequestObj,
        adResponseCallback: adResponseCallback,
        //? }
    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = RhythmOneHtb;