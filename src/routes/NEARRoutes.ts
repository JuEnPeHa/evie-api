import {getConfig} from '../config';
import * as nearAPI from 'near-api-js';
import { Account, Near, keyStores } from 'near-api-js';
import { parseContract } from 'near-contract-parser';
import { Request, Response, Router } from 'express';
import NEARRequest from '../models/NEARRequest';
//import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores'
const { networkId, nodeUrl, walletUrl, helperUrl } = getConfig(process.env.NODE_ENV || 'testnet');

//testNEAR2();
const near = new Near({
    networkId: 'testnet',
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl,
    walletUrl,
    helperUrl,
    headers: {}
})

class NEARRoutes {
    router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    getMarketplacesClean(listNftMarketplacesRaw: string[]) : string[] {
        let listNftMarketplaces: string[] = [];
        listNftMarketplacesRaw.forEach(
            (marketplace: string) => {
                if (marketplace.includes("mintbase") || 
                marketplace.includes("paras") || 
                marketplace.includes("neatar")) {
                    listNftMarketplaces.push(marketplace);
                }
            }
        );
        return listNftMarketplaces;
    }

    async getMarketplacesNotEmpties(account: string, listNftMarketplacesRaw: string[]) : Promise<string[]> {
        let listNftMarketplaces: string[] = [];
        listNftMarketplacesRaw.forEach(
            async (marketplace: string) => {
                const supply = await this.getNftSupplyForOwnerPrivate(account, marketplace)
                    if (supply != "0") {
                        listNftMarketplaces.push(marketplace);
                    }
                }
        );
        return listNftMarketplaces;
    }

    async getNftMetadata(req: Request, res: Response): Promise<void> {
        let receivedAccount: string = "";
        let listReceivedContract: string[] = [];
        let listReceivedContractClean: string[] = [];
        let listReceivedContractNotEmpties: string[] = [];
        let listTokens: any[] = [];
        ({ receivedAccount, listReceivedContract } = req.body);
        console.log(listReceivedContract);
        listReceivedContractClean = this.getMarketplacesClean(listReceivedContract);
        listReceivedContractNotEmpties = await this.getMarketplacesNotEmpties(receivedAccount, listReceivedContract);

        // @ts-ignore
        const metadata = contract.nft_metadata({
            
        });
        res.json(metadata);
    }

    async getNftTotalSupply(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const { receivedAccount, receivedContract } = req.body;
        //console.log( await testNEAR2(receivedAccount, receivedContract));
        //res.json(receivedContract);
         const account = await near.account(receivedAccount);
         const contract: nearAPI.Contract = new nearAPI.Contract(
             account,
             receivedContract,
             {
                 viewMethods: ['nft_total_supply'],
                 changeMethods: []
             }
         );
         // @ts-ignore
         const totalSupply = await contract.nft_total_supply({});
         res.json(totalSupply);
    }

   async getNftTokensForOwner(req: Request, res: Response): Promise<void> {
        const { receivedAccount, receivedContract } = req.body;
        const account = await near.account(receivedAccount);
        const contract: nearAPI.Contract = new nearAPI.Contract(
            account,
            receivedContract,
            {
                viewMethods: ['nft_tokens_for_owner'],
                changeMethods: []
            }
        );
        // @ts-ignore
        const tokens = await contract.nft_tokens_for_owner({
            "account_id": receivedAccount,
            "from_index": "0",
            "limit": 100
        });
        res.json(tokens);
   }

   async getNftSupplyForOwner(req: Request, res: Response): Promise<void> {
        const { receivedAccount, receivedContract } = req.body;
        const account = await near.account(receivedAccount);
        const contract: nearAPI.Contract = new nearAPI.Contract(
            account,
            receivedContract,
            {
                viewMethods: ['nft_supply_for_owner'],
                changeMethods: []
            }
        );
        // @ts-ignore
        const supply = await contract.nft_supply_for_owner({
            "account_id": receivedAccount
        });
        res.json(supply);
   }

   private async getNftSupplyForOwnerPrivate(
        receivedAccount: string,
        receivedContract: string
   ): Promise<string> {
        const account = await near.account(receivedAccount);
        const contract: nearAPI.Contract = new nearAPI.Contract(
            account,
            receivedContract,
            {
                viewMethods: ['nft_supply_for_owner'],
                changeMethods: []
            }
        );
        // @ts-ignore
        const supply = await contract.nft_supply_for_owner({
            "account_id": receivedAccount
        });
        return supply;
   }

   async getAllNftsFromUser(req: Request, res: Response): Promise<void> {
       const { receivedAccount, receivedContract } = req.body;
   }

    routes() {
        this.router.get('/getSupply', this.getNftTotalSupply);
        this.router.post('/getSupply', this.getNftTotalSupply);
        this.router.get('/getTokens', this.getNftTokensForOwner);
        this.router.post('/getTokens', this.getNftTokensForOwner);
        this.router.get('/getSupplyForOwner', this.getNftSupplyForOwner);
        this.router.post('/getSupplyForOwner', this.getNftSupplyForOwner);
        this.router.get('/getMetadata', this.getNftMetadata);
        this.router.post('/getMetadata', this.getNftMetadata);
    }
}

const nearRoutes = new NEARRoutes();
export default nearRoutes.router;