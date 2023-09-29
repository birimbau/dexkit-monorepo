
export const ZEROEX_AFFILIATE_ADDRESS =
    "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";




export const ZRX_EXCHANGE_ABI = [
    {
        inputs: [
            {
                name: 'order',
                type: 'tuple',
                components: [
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerAmount',
                        type: 'uint128',
                    },
                    {
                        name: 'takerAmount',
                        type: 'uint128',
                    },
                    {
                        name: 'takerTokenFeeAmount',
                        type: 'uint128',
                    },
                    {
                        name: 'maker',
                        type: 'address',
                    },
                    {
                        name: 'taker',
                        type: 'address',
                    },
                    {
                        name: 'sender',
                        type: 'address',
                    },
                    {
                        name: 'feeRecipient',
                        type: 'address',
                    },
                    {
                        name: 'pool',
                        type: 'bytes32',
                    },
                    {
                        name: 'expiry',
                        type: 'uint64',
                    },
                    {
                        name: 'salt',
                        type: 'uint256',
                    },
                ],
            },
        ],
        name: 'cancelLimitOrder',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
]