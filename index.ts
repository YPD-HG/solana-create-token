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

    await mintTo(connection, mintWallet, tokenAddress, mintTokenAccount.address, mintWallet.publicKey, 100000000, [], undefined, TOKEN_PROGRAM_ID);

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(connection, mintWallet, tokenAddress, receiver, undefined, undefined, undefined, TOKEN_PROGRAM_ID);
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
    // A mint wallet created
    // Note that this wallet will have authority to create new token, or create fresh supply of token.
    const mintWallet = await Keypair.generate();

    // Lets add some balance into the Wallet, becoz to create token, it need to pay some transaction fees.
    await airdrop(mintWallet.publicKey, 5);
    await airdrop(new PublicKey("4658ZW5WaNCps9rPWauL5TBk94SwMMKTk3yWK8PzXufG"), 5)
    const creatorTokenAddress = await createTheMint(mintWallet);
    // We now have created a mint, we also have the public address of that mint,
    // And we already have the public/private key for that mint wallet, being authority, can create more supply of this created token.

    await transferTokens(creatorTokenAddress, mintWallet, new PublicKey("4658ZW5WaNCps9rPWauL5TBk94SwMMKTk3yWK8PzXufG"))

    console.log(`Creator token address : ${creatorTokenAddress}`);
    console.log(`mintWallet address : ${mintWallet.publicKey}`);
})()