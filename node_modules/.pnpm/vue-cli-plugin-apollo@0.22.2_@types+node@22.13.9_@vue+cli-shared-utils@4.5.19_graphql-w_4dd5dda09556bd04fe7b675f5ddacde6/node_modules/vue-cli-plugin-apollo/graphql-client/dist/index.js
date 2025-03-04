"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApolloClient = createApolloClient;
exports.restartWebsockets = restartWebsockets;

var _apolloClient = require("apollo-client");

var _apolloLink = require("apollo-link");

var _apolloUploadClient = require("apollo-upload-client");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _messageTypes = _interopRequireDefault(require("subscriptions-transport-ws/dist/message-types"));

var _apolloLinkWs = require("apollo-link-ws");

var _apolloUtilities = require("apollo-utilities");

var _apolloLinkPersistedQueries = require("apollo-link-persisted-queries");

var _apolloLinkContext = require("apollo-link-context");

var _apolloLinkState = require("apollo-link-state");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Create the apollo client
function createApolloClient(_ref) {
  var _ref$clientId = _ref.clientId,
      clientId = _ref$clientId === void 0 ? 'defaultClient' : _ref$clientId,
      httpEndpoint = _ref.httpEndpoint,
      _ref$wsEndpoint = _ref.wsEndpoint,
      wsEndpoint = _ref$wsEndpoint === void 0 ? null : _ref$wsEndpoint,
      _ref$tokenName = _ref.tokenName,
      tokenName = _ref$tokenName === void 0 ? 'apollo-token' : _ref$tokenName,
      _ref$persisting = _ref.persisting,
      persisting = _ref$persisting === void 0 ? false : _ref$persisting,
      _ref$ssr = _ref.ssr,
      ssr = _ref$ssr === void 0 ? false : _ref$ssr,
      _ref$websocketsOnly = _ref.websocketsOnly,
      websocketsOnly = _ref$websocketsOnly === void 0 ? false : _ref$websocketsOnly,
      _ref$link = _ref.link,
      link = _ref$link === void 0 ? null : _ref$link,
      _ref$preAuthLinks = _ref.preAuthLinks,
      preAuthLinks = _ref$preAuthLinks === void 0 ? [] : _ref$preAuthLinks,
      _ref$defaultHttpLink = _ref.defaultHttpLink,
      defaultHttpLink = _ref$defaultHttpLink === void 0 ? true : _ref$defaultHttpLink,
      _ref$httpLinkOptions = _ref.httpLinkOptions,
      httpLinkOptions = _ref$httpLinkOptions === void 0 ? {} : _ref$httpLinkOptions,
      _ref$cache = _ref.cache,
      cache = _ref$cache === void 0 ? null : _ref$cache,
      _ref$inMemoryCacheOpt = _ref.inMemoryCacheOptions,
      inMemoryCacheOptions = _ref$inMemoryCacheOpt === void 0 ? {} : _ref$inMemoryCacheOpt,
      _ref$apollo = _ref.apollo,
      apollo = _ref$apollo === void 0 ? {} : _ref$apollo,
      _ref$clientState = _ref.clientState,
      clientState = _ref$clientState === void 0 ? null : _ref$clientState,
      _ref$getAuth = _ref.getAuth,
      getAuth = _ref$getAuth === void 0 ? defaultGetAuth : _ref$getAuth,
      _ref$typeDefs = _ref.typeDefs,
      typeDefs = _ref$typeDefs === void 0 ? undefined : _ref$typeDefs,
      _ref$resolvers = _ref.resolvers,
      resolvers = _ref$resolvers === void 0 ? undefined : _ref$resolvers,
      _ref$onCacheInit = _ref.onCacheInit,
      onCacheInit = _ref$onCacheInit === void 0 ? undefined : _ref$onCacheInit;
  var wsClient, authLink, stateLink;
  var disableHttp = websocketsOnly && !ssr && wsEndpoint; // Apollo cache

  if (!cache) {
    cache = new _apolloCacheInmemory.InMemoryCache(inMemoryCacheOptions);
  }

  if (!disableHttp) {
    var httpLink = (0, _apolloUploadClient.createUploadLink)(_objectSpread({
      uri: httpEndpoint
    }, httpLinkOptions));

    if (!link) {
      link = httpLink;
    } else if (defaultHttpLink) {
      link = (0, _apolloLink.from)([link, httpLink]);
    } // HTTP Auth header injection


    authLink = (0, _apolloLinkContext.setContext)( /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, _ref2) {
        var headers, Authorization, authorizationHeader;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                headers = _ref2.headers;
                _context.next = 3;
                return getAuth(tokenName);

              case 3:
                Authorization = _context.sent;
                authorizationHeader = Authorization ? {
                  Authorization: Authorization
                } : {};
                return _context.abrupt("return", {
                  headers: _objectSpread(_objectSpread({}, headers), authorizationHeader)
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref3.apply(this, arguments);
      };
    }()); // Concat all the http link parts

    link = authLink.concat(link);

    if (preAuthLinks.length) {
      link = (0, _apolloLink.from)(preAuthLinks).concat(authLink);
    }
  } // On the server, we don't want WebSockets and Upload links


  if (!ssr) {
    // If on the client, recover the injected state
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-underscore-dangle
      var state = window.__APOLLO_STATE__;

      if (state && state[clientId]) {
        // Restore state
        cache.restore(state[clientId]);
      }
    }

    if (!disableHttp) {
      var persistingOpts = {};

      if (_typeof(persisting) === 'object' && persisting != null) {
        persistingOpts = persisting;
        persisting = true;
      }

      if (persisting === true) {
        link = (0, _apolloLinkPersistedQueries.createPersistedQueryLink)(persistingOpts).concat(link);
      }
    } // Web socket


    if (wsEndpoint) {
      wsClient = new _subscriptionsTransportWs.SubscriptionClient(wsEndpoint, {
        reconnect: true,
        connectionParams: function connectionParams() {
          var Authorization = getAuth(tokenName);
          return Authorization ? {
            Authorization: Authorization,
            headers: {
              Authorization: Authorization
            }
          } : {};
        }
      }); // Create the subscription websocket link

      var wsLink = new _apolloLinkWs.WebSocketLink(wsClient);

      if (disableHttp) {
        link = link ? link.concat(wsLink) : wsLink;
      } else {
        link = (0, _apolloLink.split)( // split based on operation type
        function (_ref4) {
          var query = _ref4.query;

          var _getMainDefinition = (0, _apolloUtilities.getMainDefinition)(query),
              kind = _getMainDefinition.kind,
              operation = _getMainDefinition.operation;

          return kind === 'OperationDefinition' && operation === 'subscription';
        }, wsLink, link);
      }
    }
  }

  if (clientState) {
    console.warn('clientState is deprecated, see https://vue-cli-plugin-apollo.netlify.com/guide/client-state.html');
    stateLink = (0, _apolloLinkState.withClientState)(_objectSpread({
      cache: cache
    }, clientState));
    link = (0, _apolloLink.from)([stateLink, link]);
  }

  var apolloClient = new _apolloClient.ApolloClient(_objectSpread(_objectSpread({
    link: link,
    cache: cache
  }, ssr ? {
    // Set this on the server to optimize queries when SSR
    ssrMode: true
  } : {
    // This will temporary disable query force-fetching
    ssrForceFetchDelay: 100,
    // Apollo devtools
    connectToDevTools: process.env.NODE_ENV !== 'production'
  }), {}, {
    typeDefs: typeDefs,
    resolvers: resolvers
  }, apollo)); // Re-write the client state defaults on cache reset

  if (stateLink) {
    apolloClient.onResetStore(stateLink.writeDefaults);
  }

  if (onCacheInit) {
    onCacheInit(cache);
    apolloClient.onResetStore(function () {
      return onCacheInit(cache);
    });
  }

  return {
    apolloClient: apolloClient,
    wsClient: wsClient,
    stateLink: stateLink
  };
}

function restartWebsockets(wsClient) {
  // Copy current operations
  var operations = Object.assign({}, wsClient.operations); // Close connection

  wsClient.close(true); // Open a new one

  wsClient.connect(); // Push all current operations to the new connection

  Object.keys(operations).forEach(function (id) {
    wsClient.sendMessage(id, _messageTypes["default"].GQL_START, operations[id].options);
  });
}

function defaultGetAuth(tokenName) {
  if (typeof window !== 'undefined') {
    // get the authentication token from local storage if it exists
    var token = window.localStorage.getItem(tokenName); // return the headers to the context so httpLink can read them

    return token ? "Bearer ".concat(token) : '';
  }
}