geth --datadir data --networkid 15 \
	--nat extip:192.168.1.116 --http \
	--http.api debug,eth,miner,web3,admin,personal,net \
	--http.addr "0.0.0.0" --http.corsdomain "*" \
	--allow-insecure-unlock \
	--mine --miner.threads 2 \
	console
