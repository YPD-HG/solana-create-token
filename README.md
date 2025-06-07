# solana-create-token

This project demonstrates how to create a new SPL token mint on a local Solana cluster, mint tokens to the mint authority’s token account, and transfer tokens to a receiver's associated token account.

---

## Overview

- Generates a new mint authority wallet (keypair).
- Requests an airdrop of SOL to cover transaction fees.
- Creates a new token mint with 8 decimal places.
- Mints a fixed amount of tokens to the mint authority’s token account.
- Creates (if needed) an associated token account for the receiver.
- Transfers the minted tokens from the mint authority’s token account to the receiver’s token account.
- Logs the relevant public keys.

---

## How It Works (Intuition)

1. **Mint Authority Wallet**: Controls creation of new tokens for the mint.
2. **Token Mint**: Represents the token itself (like the token’s "contract").
3. **Associated Token Accounts**: Special accounts linked to wallets for holding specific tokens.
4. **Minting**: Creates new tokens and credits them to the mint authority’s token account.
5. **Transfer**: Moves tokens from the mint authority’s token account to the receiver’s token account.

Tokens live in **associated token accounts**, not directly in wallets.

---

![Screen Shot 2025-06-07 at 10 52 47 PM](https://github.com/user-attachments/assets/ed1fdef6-57af-4e45-97e9-00c2909ae0db)


## Usage

1. Install dependencies:

   ```bash
   npm install
