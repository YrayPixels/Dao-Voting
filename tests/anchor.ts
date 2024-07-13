import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import type { DaoVoting } from "../target/types/dao_voting";

describe("Test", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DaoVoting as anchor.Program<DaoVoting>;
  
  // it("initialize", async () => {
  //   let title = "New Program Item";

  //   const [propsalPda, proposalBump] = await web3.PublicKey.findProgramAddress(
  //     [
  //       Buffer.from("proposals"),
  //       pg.wallets.programmeOwner.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );

  //   const txHash = await program.methods
  //     .createProposal(title)
  //     .accounts({
  //       proposal: propsalPda,
  //       user: pg.wallets.programmeOwner.publicKey,
  //       systemProgram: web3.SystemProgram.programId,
  //     })
  //     .signers([])
  //     .rpc();

  //   let proposal = program.account.proposal.fetch(propsalPda.toBase58());
  //   console.log(proposal);
  //   console.log(txHash);
  // });

  it("Votes", async () => {
    const [propsalPda, proposalBump] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("proposals"),
        pg.wallets.programmeOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [voterPDA, voterBump] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("voter"), program.provider.publicKey.toBuffer()],
      program.programId
    );
    try {
      // Cast a vote
      const txHash = await program.methods
        .vote(true)
        .accounts({
          proposal: propsalPda,
          voter: voterPDA,
          user: program.provider.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([program.provider.wallet.payer]) // Ensure the correct signer is provided
        .rpc();

      console.log("Transaction hash:", txHash);
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  });
});
