import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [selectedOption, setSelectedOption] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const blockDetails = await alchemy.core.getBlockWithTransactions(blockNumber);
      console.log('blockDetails :>> ', blockDetails);
      setSearchResult(blockDetails.transactions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      Block Number: {blockNumber}

      <div>
        <br />
        <select value={selectedOption} onChange={handleOptionChange}>
          <option>Block Details</option>
          <option>Transactions List</option>
        </select>
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {selectedOption === 'Block Details' && (
            <div>
              {searchResult.length > 0 && (
                <div>
                  <div>Block Number: {searchResult[0].blockNumber}</div>
                  <div>Block Hash: {searchResult[0].blockHash}</div>
                </div>
              )}
            </div>
          )}

          {selectedOption === 'Transactions List' && (
            <div>
              {searchResult.map((transaction, index) => (
                <div key={index}>
                  <a href={transaction.url}>{transaction.hash}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
