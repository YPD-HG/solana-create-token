import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js"
import { airdrop } from "../airdrop";
import { createMint, createTransferInstruction, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID, transfer } from "@solana/spl-token";

const createTheMint = async (mintWallet) => {
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const creatorToken = await createMint(connection, mintWallet, mintWallet.publicKey, null, 8, undefined, undefined, TOKEN_PROGRAM_ID)
    return creatorToken;
}

const transferTokens = async (tokenAddress: PublicKey, mintWallet: Keypair, receiver: PublicKey) => {
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    // const creatorToken = new Token(connection, tokenAddress, TOKEN_PROGRAM_ID, mintWallet);

    const mintTokenAccount = await getOrCreateAssociatedTokenAccount(connection, mintWallet, tokenAddress, mintWallet.publicKey);
    // A Token Account or Wallet is created for the Token.
    await mintTo(connection, mintWallet, tokenAddress, mintTokenAccount.address, mintWallet.publicKey, 100000000, [], undefined, TOKEN_PROGRAM_ID);
    // Mint creates 1 Token for the wallet

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(connection, mintWallet, tokenAddress, receiver, undefined, undefined, undefined, TOKEN_PROGRAM_ID);
    // Creates a wallet for the receiver (to hold this token).
    // Now the Token will be transferred from Owner to the receiver.

    console.log(`ReceiverTokenAccount address : ${receiverTokenAccount.address}`);

    const transaction = new Transaction().add(
        createTransferInstruction(
            mintTokenAccount.address,
            receiverTokenAccount.address,
            mintWallet.publicKey,
            100000000,
            [],
            TOKEN_PROGRAM_ID
        )
    );

    await sendAndConfirmTransaction(connection, transaction, [mintWallet], { commitment: "confirmed" });

}

(async () => {
    // Generate a new Keypair for the mint authority wallet.
    // This wallet will control minting (i.e., creating new supply) for the token.
    // Note: `Keypair.generate()` gives a new random wallet every time it's called.
    const mintWallet = await Keypair.generate();

    // Airdrop some SOL to the mint wallet to cover transaction fees for minting and transfers.
    await airdrop(mintWallet.publicKey, 5);

    // Create a new token mint, using the mintWallet as the mint authority.
    // This returns the public address of the token mint (i.e., the token itself).
    const creatorTokenAddress = await createTheMint(mintWallet);

    // Mint tokens and transfer them to another wallet.
    await transferTokens(creatorTokenAddress, mintWallet, new PublicKey("4658ZW5WaNCps9rPWauL5TBk94SwMMKTk3yWK8PzXufG"));

    // Log important addresses for inspection or testing.
    console.log(`Creator token address : ${creatorTokenAddress}`);
    console.log(`mintWallet address : ${mintWallet.publicKey}`);

})()