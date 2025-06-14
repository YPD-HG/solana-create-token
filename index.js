"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_js_1 = require("@solana/web3.js");
var airdrop_1 = require("../airdrop");
var spl_token_1 = require("@solana/spl-token");
var createTheMint = function (mintWallet) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, creatorToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                connection = new web3_js_1.Connection("http://127.0.0.1:8899", "confirmed");
                return [4 /*yield*/, (0, spl_token_1.createMint)(connection, mintWallet, mintWallet.publicKey, null, 8, undefined, undefined, spl_token_1.TOKEN_PROGRAM_ID)];
            case 1:
                creatorToken = _a.sent();
                return [2 /*return*/, creatorToken];
        }
    });
}); };
var transferTokens = function (tokenAddress, mintWallet, receiver) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, mintTokenAccount, receiverTokenAccount, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                connection = new web3_js_1.Connection("http://127.0.0.1:8899", "confirmed");
                return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintWallet, tokenAddress, mintWallet.publicKey)];
            case 1:
                mintTokenAccount = _a.sent();
                // A Token Account or Wallet is created for the Token.
                return [4 /*yield*/, (0, spl_token_1.mintTo)(connection, mintWallet, tokenAddress, mintTokenAccount.address, mintWallet.publicKey, 100000000, [], undefined, spl_token_1.TOKEN_PROGRAM_ID)];
            case 2:
                // A Token Account or Wallet is created for the Token.
                _a.sent();
                return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintWallet, tokenAddress, receiver, undefined, undefined, undefined, spl_token_1.TOKEN_PROGRAM_ID)];
            case 3:
                receiverTokenAccount = _a.sent();
                // Creates a wallet for the receiver (to hold this token).
                // Now the Token will be transferred from Owner to the receiver.
                console.log("ReceiverTokenAccount address : ".concat(receiverTokenAccount.address));
                transaction = new web3_js_1.Transaction().add((0, spl_token_1.createTransferInstruction)(mintTokenAccount.address, receiverTokenAccount.address, mintWallet.publicKey, 100000000, [], spl_token_1.TOKEN_PROGRAM_ID));
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [mintWallet], { commitment: "confirmed" })];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var mintWallet, connection, creatorTokenAddress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, web3_js_1.Keypair.generate()];
            case 1:
                mintWallet = _a.sent();
                connection = new web3_js_1.Connection("http://127.0.0.1:8899", "confirmed");
                // Airdrop some SOL to the mint wallet to cover transaction fees for minting and transfers.
                return [4 /*yield*/, (0, airdrop_1.airdrop)(mintWallet.publicKey, 5)];
            case 2:
                // Airdrop some SOL to the mint wallet to cover transaction fees for minting and transfers.
                _a.sent();
                return [4 /*yield*/, createTheMint(mintWallet)];
            case 3:
                creatorTokenAddress = _a.sent();
                // Mint tokens and transfer them to another wallet.
                return [4 /*yield*/, transferTokens(creatorTokenAddress, mintWallet, new web3_js_1.PublicKey("4658ZW5WaNCps9rPWauL5TBk94SwMMKTk3yWK8PzXufG"))];
            case 4:
                // Mint tokens and transfer them to another wallet.
                _a.sent();
                // Log important addresses for inspection or testing.
                console.log("Creator token address : ".concat(creatorTokenAddress));
                console.log("mintWallet address : ".concat(mintWallet.publicKey));
                return [2 /*return*/];
        }
    });
}); })();
