import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
  ActionError,
} from '@solana/actions';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { programAddress, decision } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/actions/${programAddress}/bet?decision=${decision}`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      type: 'action',
      title: `Bet ${decision.toUpperCase()} on Program`,
      icon: 'https://picsum.photos/200/300',
      description: `Place the same '${decision}' bet as another user on program ${programAddress}`,
      label: 'Copy Bet',
      links: {
        actions: [
          {
            type: 'transaction',
            label: `Bet ${decision.toUpperCase()}`,
            href: `${baseHref}&amount={amount}`,
            parameters: [
              {
                name: 'amount', // parameter name in the `href` above
                label: 'Enter the amount of SOL to bet', // placeholder of the text input
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: 'An unknown error occurred' };
    if (typeof err == 'string') actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { programAddress, decision } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();
    let user: PublicKey;
    try {
      user = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }
    const connection = new Connection(clusterApiUrl('devnet'));

    const programId = new PublicKey(programAddress);

    const instruction = new TransactionInstruction({
      programId,
      keys: [{ pubkey: user, isSigner: true, isWritable: true }],
      data: Buffer.from(decision),
    });

    const transaction = new Transaction().add(instruction);
    transaction.feePayer = user;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: 'transaction',
        transaction,
        message: `You are betting "${decision}" on ${programAddress}`,
      },
    });

    return Response.json(payload, { headers });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: 'An unknown error occurred' };
    if (typeof err == 'string') actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  const segments = requestUrl.pathname.split('/');
  const programAddress = segments[segments.indexOf('actions') + 1];

  if (!programAddress) throw 'Missing program address';
  if (!requestUrl.searchParams.get('decision')) throw 'Missing decision';

  return {
    programAddress,
    decision: requestUrl.searchParams.get('decision')!,
  };
}
