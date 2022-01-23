/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/apollo-server.ts":
/*!******************************!*\
  !*** ./src/apollo-server.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.graphqlHandler = void 0;
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
const dynamodb_1 = __webpack_require__(/*! aws-sdk/clients/dynamodb */ "aws-sdk/clients/dynamodb");
const resolvers_1 = __webpack_require__(/*! ./resolvers */ "./src/resolvers.ts");
const type_defs_1 = __webpack_require__(/*! ./type-defs */ "./src/type-defs.ts");
const establishmentsDB_1 = __importDefault(__webpack_require__(/*! ./datasources/establishmentsDB */ "./src/datasources/establishmentsDB.ts"));
const client = new dynamodb_1.DocumentClient({
    apiVersion: 'latest',
    region: 'us-east-1',
});
const apolloServer = new apollo_server_lambda_1.ApolloServer({
    resolvers: resolvers_1.resolvers,
    typeDefs: type_defs_1.typeDefs,
    context: ({ event, context }) => {
        console.log('event: ', event);
        console.log('context: ', context);
        return {
            headers: event.headers,
            functionName: context.functionName,
            event,
            context
        };
    },
    dataSources: () => {
        return {
            establishmentsDB: new establishmentsDB_1.default(client)
        };
    }
});
exports.graphqlHandler = apolloServer.createHandler({
    expressGetMiddlewareOptions: {
        cors: {
            origin: '*',
            credentials: true,
        },
    },
});


/***/ }),

/***/ "./src/datasources/establishmentsDB.ts":
/*!*********************************************!*\
  !*** ./src/datasources/establishmentsDB.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const apollo_datasource_dynamodb_1 = __webpack_require__(/*! apollo-datasource-dynamodb */ "apollo-datasource-dynamodb");
const tableName = "establishments";
const tableKeySchema = [
    {
        AttributeName: "id",
        KeyType: "HASH",
    },
];
class EstablishmentsDB extends apollo_datasource_dynamodb_1.DynamoDBDataSource {
    constructor(client) {
        super(tableName, tableKeySchema, undefined, client);
        this.ttl = 30 * 60;
    }
    getEstablishment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const getItemInput = {
                TableName: tableName,
                ConsistentRead: true,
                Key: { id },
            };
            return this.getItem(getItemInput, this.ttl);
        });
    }
    getAllEstablishments() {
        return __awaiter(this, void 0, void 0, function* () {
            const scanInput = {
                TableName: tableName,
                ConsistentRead: true,
            };
            return this.scan(scanInput, this.ttl);
        });
    }
    createEstablishment(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const newEstablishment = {
                id,
                name
            };
            return yield this.put(newEstablishment, this.ttl);
        });
    }
}
exports["default"] = EstablishmentsDB;


/***/ }),

/***/ "./src/environment.ts":
/*!****************************!*\
  !*** ./src/environment.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.environment = void 0;
exports.environment = {
    secretMessage: process.env.SECRET_MESSAGE,
    apiToken: process.env.API_TOKEN,
};


/***/ }),

/***/ "./src/resolvers.ts":
/*!**************************!*\
  !*** ./src/resolvers.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvers = void 0;
const environment_1 = __webpack_require__(/*! ./environment */ "./src/environment.ts");
exports.resolvers = {
    Query: {
        testMessage: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            return `${environment_1.environment.secretMessage}. Your message is ${args.search}`;
        }),
        getEstablishment: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            return context.dataSources.establishmentsDB.getEstablishment(args.id);
        }),
        getAllEstablishments: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            return context.dataSources.establishmentsDB.getAllEstablishments();
        }),
    },
    Mutation: {
        createEstablishment: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            return context.dataSources.establishmentsDB.createEstablishment(args.id, args.name);
        })
    }
};


/***/ }),

/***/ "./src/type-defs.ts":
/*!**************************!*\
  !*** ./src/type-defs.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeDefs = void 0;
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
exports.typeDefs = (0, apollo_server_lambda_1.gql) `
  type Establishment {
    id: String!,
    name: String!
  }
  scalar Json
  type Query {
    testMessage: String!,
    getEstablishment(id: String!): Establishment,
    getAllEstablishments: [Establishment],
  }
  type Mutation {
    createEstablishment(id: String!, name: String!): Establishment
  }
`;


/***/ }),

/***/ "apollo-datasource-dynamodb":
/*!*********************************************!*\
  !*** external "apollo-datasource-dynamodb" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("apollo-datasource-dynamodb");

/***/ }),

/***/ "apollo-server-lambda":
/*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("apollo-server-lambda");

/***/ }),

/***/ "aws-sdk/clients/dynamodb":
/*!*******************************************!*\
  !*** external "aws-sdk/clients/dynamodb" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("aws-sdk/clients/dynamodb");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/apollo-server.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBSEE7QUFJQTtBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUkE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbkJBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7Ozs7Ozs7O0FDaEJBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUV2QkE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcG9sbG8tc2VydmVyLy4vc3JjL2Fwb2xsby1zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vYXBvbGxvLXNlcnZlci8uL3NyYy9kYXRhc291cmNlcy9lc3RhYmxpc2htZW50c0RCLnRzIiwid2VicGFjazovL2Fwb2xsby1zZXJ2ZXIvLi9zcmMvZW52aXJvbm1lbnQudHMiLCJ3ZWJwYWNrOi8vYXBvbGxvLXNlcnZlci8uL3NyYy9yZXNvbHZlcnMudHMiLCJ3ZWJwYWNrOi8vYXBvbGxvLXNlcnZlci8uL3NyYy90eXBlLWRlZnMudHMiLCJ3ZWJwYWNrOi8vYXBvbGxvLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImFwb2xsby1kYXRhc291cmNlLWR5bmFtb2RiXCIiLCJ3ZWJwYWNrOi8vYXBvbGxvLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIiLCJ3ZWJwYWNrOi8vYXBvbGxvLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImF3cy1zZGsvY2xpZW50cy9keW5hbW9kYlwiIiwid2VicGFjazovL2Fwb2xsby1zZXJ2ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXBvbGxvLXNlcnZlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Fwb2xsby1zZXJ2ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Fwb2xsby1zZXJ2ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgQXBvbGxvU2VydmVyIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1sYW1iZGEnO1xuaW1wb3J0IHsgRG9jdW1lbnRDbGllbnQgfSBmcm9tICdhd3Mtc2RrL2NsaWVudHMvZHluYW1vZGInO1xuXG5pbXBvcnQgeyByZXNvbHZlcnMgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyB0eXBlRGVmcyB9IGZyb20gJy4vdHlwZS1kZWZzJztcblxuaW1wb3J0IEVzdGFibGlzaG1lbnRzREIgZnJvbSAnLi9kYXRhc291cmNlcy9lc3RhYmxpc2htZW50c0RCJztcbi8vIGltcG9ydCBNb3ZpZXNBUEkgZnJvbSAnLi9kYXRhc291cmNlcy9tb3ZpZXNBUEknO1xuLy8gaW1wb3J0IEltZGJBUEkgZnJvbSAnLi9kYXRhc291cmNlcy9pbWRiQVBJJztcblxuY29uc3QgY2xpZW50OiBEb2N1bWVudENsaWVudCA9IG5ldyBEb2N1bWVudENsaWVudCh7XG4gICAgYXBpVmVyc2lvbjogJ2xhdGVzdCcsXG4gICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbn0pO1xuXG5cbmNvbnN0IGFwb2xsb1NlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuICAgIHJlc29sdmVycyxcbiAgICB0eXBlRGVmcyxcbiAgICBjb250ZXh0OiAoe2V2ZW50LCBjb250ZXh0fSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnZXZlbnQ6ICcsIGV2ZW50KTtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvbnRleHQ6ICcsIGNvbnRleHQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVhZGVyczogZXZlbnQuaGVhZGVycyxcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogY29udGV4dC5mdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YVNvdXJjZXM6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIG1vdmllc0FQSTogbmV3IE1vdmllc0FQSSgpLFxuICAgICAgICAgICAgLy8gaW1kYkFQSTogbmV3IEltZGJBUEkoKSxcbiAgICAgICAgICAgIGVzdGFibGlzaG1lbnRzREI6IG5ldyBFc3RhYmxpc2htZW50c0RCKGNsaWVudClcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgZ3JhcGhxbEhhbmRsZXIgPSBhcG9sbG9TZXJ2ZXIuY3JlYXRlSGFuZGxlcih7XG4gICAgZXhwcmVzc0dldE1pZGRsZXdhcmVPcHRpb25zOiB7XG4gICAgICAgIGNvcnM6IHtcbiAgICAgICAgICAgIG9yaWdpbjogJyonLFxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgfSxcbn0pOyIsImltcG9ydCB7IER5bmFtb0RCRGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1keW5hbW9kYlwiO1xuaW1wb3J0IHsgRG9jdW1lbnRDbGllbnQgfSBmcm9tIFwiYXdzLXNkay9jbGllbnRzL2R5bmFtb2RiXCI7XG5cbnR5cGUgRXN0YWJsaXNobWVudCA9IHtcbiAgICBpZDogbnVtYmVyLFxuICAgIG5hbWU6IHN0cmluZ1xufVxuXG5jb25zdCB0YWJsZU5hbWUgPSBcImVzdGFibGlzaG1lbnRzXCI7XG5jb25zdCB0YWJsZUtleVNjaGVtYTogRG9jdW1lbnRDbGllbnQuS2V5U2NoZW1hID0gW1xuICAgIHtcbiAgICAgICAgQXR0cmlidXRlTmFtZTogXCJpZFwiLFxuICAgICAgICBLZXlUeXBlOiBcIkhBU0hcIixcbiAgICB9LFxuXTtcblxuY2xhc3MgRXN0YWJsaXNobWVudHNEQiBleHRlbmRzIER5bmFtb0RCRGF0YVNvdXJjZTxFc3RhYmxpc2htZW50PiB7XG5cbiAgcHJpdmF0ZSByZWFkb25seSB0dGwgPSAzMCAqIDYwOyAvLyAzMG1pbnV0ZXNcblxuICBjb25zdHJ1Y3RvcihjbGllbnQ/OiBEb2N1bWVudENsaWVudCkge1xuICAgIHN1cGVyKHRhYmxlTmFtZSwgdGFibGVLZXlTY2hlbWEsIHVuZGVmaW5lZCwgY2xpZW50KTtcbiAgfVxuXG4gIGFzeW5jIGdldEVzdGFibGlzaG1lbnQoaWQ6IHN0cmluZyk6IFByb21pc2U8RXN0YWJsaXNobWVudD4ge1xuICAgIGNvbnN0IGdldEl0ZW1JbnB1dDogRG9jdW1lbnRDbGllbnQuR2V0SXRlbUlucHV0ID0ge1xuICAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gICAgICBDb25zaXN0ZW50UmVhZDogdHJ1ZSxcbiAgICAgIEtleTogeyBpZCB9LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShnZXRJdGVtSW5wdXQsIHRoaXMudHRsKTtcbiAgfVxuXG4gIGFzeW5jIGdldEFsbEVzdGFibGlzaG1lbnRzKCk6IFByb21pc2U8RXN0YWJsaXNobWVudFtdPiB7XG4gICAgY29uc3Qgc2NhbklucHV0OiBEb2N1bWVudENsaWVudC5TY2FuSW5wdXQgPSB7XG4gICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICAgIENvbnNpc3RlbnRSZWFkOiB0cnVlLFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2NhbihzY2FuSW5wdXQsIHRoaXMudHRsKTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUVzdGFibGlzaG1lbnQoaWQ6IG51bWJlciwgbmFtZTogc3RyaW5nKTogUHJvbWlzZTxFc3RhYmxpc2htZW50PiB7XG4gICAgICBjb25zdCBuZXdFc3RhYmxpc2htZW50OiBFc3RhYmxpc2htZW50ID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgbmFtZVxuICAgICAgfTtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnB1dChuZXdFc3RhYmxpc2htZW50LCB0aGlzLnR0bCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXN0YWJsaXNobWVudHNEQjtcbiIsInR5cGUgRW52aXJvbm1lbnQgPSB7XG4gICAgc2VjcmV0TWVzc2FnZTogc3RyaW5nLFxuICAgIGFwaVRva2VuOiBzdHJpbmdcbn07XG5cbmV4cG9ydCBjb25zdCBlbnZpcm9ubWVudDogRW52aXJvbm1lbnQgPSB7XG4gICAgc2VjcmV0TWVzc2FnZTogcHJvY2Vzcy5lbnYuU0VDUkVUX01FU1NBR0UgYXMgc3RyaW5nLFxuICAgIGFwaVRva2VuOiBwcm9jZXNzLmVudi5BUElfVE9LRU4gYXMgc3RyaW5nLFxufTsiLCJpbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5leHBvcnQgY29uc3QgcmVzb2x2ZXJzID0ge1xuICBRdWVyeToge1xuICAgIHRlc3RNZXNzYWdlOiBhc3luYyAocGFyZW50OiBhbnksIGFyZ3M6IGFueSwgY29udGV4dDogYW55LCBpbmZvOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiBgJHtlbnZpcm9ubWVudC5zZWNyZXRNZXNzYWdlfS4gWW91ciBtZXNzYWdlIGlzICR7YXJncy5zZWFyY2h9YDtcbiAgICB9LFxuICAgIGdldEVzdGFibGlzaG1lbnQ6IGFzeW5jIChwYXJlbnQ6IGFueSwgYXJnczogYW55LCBjb250ZXh0OiBhbnksIGluZm86IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbnRleHQuZGF0YVNvdXJjZXMuZXN0YWJsaXNobWVudHNEQi5nZXRFc3RhYmxpc2htZW50KGFyZ3MuaWQpO1xuICAgIH0sXG4gICAgZ2V0QWxsRXN0YWJsaXNobWVudHM6IGFzeW5jIChwYXJlbnQ6IGFueSwgYXJnczogYW55LCBjb250ZXh0OiBhbnksIGluZm86IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbnRleHQuZGF0YVNvdXJjZXMuZXN0YWJsaXNobWVudHNEQi5nZXRBbGxFc3RhYmxpc2htZW50cygpO1xuICAgIH0sXG4gIH0sXG4gIE11dGF0aW9uOiB7XG4gICAgY3JlYXRlRXN0YWJsaXNobWVudDogYXN5bmMgKHBhcmVudDogYW55LCBhcmdzOiBhbnksIGNvbnRleHQ6IGFueSwgaW5mbzogYW55KSA9PiB7XG4gICAgICByZXR1cm4gY29udGV4dC5kYXRhU291cmNlcy5lc3RhYmxpc2htZW50c0RCLmNyZWF0ZUVzdGFibGlzaG1lbnQoYXJncy5pZCwgYXJncy5uYW1lKTtcbiAgICB9XG4gIH1cbn07IiwiaW1wb3J0IHsgZ3FsIH0gZnJvbSBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCI7XG5cbmV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IGdxbGBcbiAgdHlwZSBFc3RhYmxpc2htZW50IHtcbiAgICBpZDogU3RyaW5nISxcbiAgICBuYW1lOiBTdHJpbmchXG4gIH1cbiAgc2NhbGFyIEpzb25cbiAgdHlwZSBRdWVyeSB7XG4gICAgdGVzdE1lc3NhZ2U6IFN0cmluZyEsXG4gICAgZ2V0RXN0YWJsaXNobWVudChpZDogU3RyaW5nISk6IEVzdGFibGlzaG1lbnQsXG4gICAgZ2V0QWxsRXN0YWJsaXNobWVudHM6IFtFc3RhYmxpc2htZW50XSxcbiAgfVxuICB0eXBlIE11dGF0aW9uIHtcbiAgICBjcmVhdGVFc3RhYmxpc2htZW50KGlkOiBTdHJpbmchLCBuYW1lOiBTdHJpbmchKTogRXN0YWJsaXNobWVudFxuICB9XG5gO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLWRhdGFzb3VyY2UtZHluYW1vZGJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXdzLXNkay9jbGllbnRzL2R5bmFtb2RiXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcG9sbG8tc2VydmVyLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9