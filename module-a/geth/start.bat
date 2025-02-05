geth init --datadir data genesis.json


geth --datadir data --networkid 12345 --unlock 0x1A97A9D06d661fc45E523B391aAc747108C919DB --allow-insecure-unlock --http --http.corsdomain="*" --http.api web3,eth,debug,personal,net,miner --miner.etherbase 0x1A97A9D06d661fc45E523B391aAc747108C919DB
