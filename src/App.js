import "./App.css"
import { useMetamask } from "./hooks/useMetamask"
import Transaction from "./components/Transaction"
import { useEffect } from "react"

function App() {
	//useLogin hook
	const { account, error, loading, balance, login, getBalance, logout } =
		useMetamask()

	// get balance on page load if account is present
	const accountAddress = localStorage.getItem("account")
	useEffect(() => {
		if (accountAddress) {
			getBalance(accountAddress)
		}
	}, [])

	if (error) return <h3>{error}</h3>

	if (loading) return <h3>Loading...</h3>

	return (
		<div className='App'>
			<section>
				{accountAddress ? (
					<section className='detail-section'>
						<button onClick={logout}>Logout</button>
						<h1>
							<span className='blue-color'>Account:</span> <br />
							{account}
						</h1>
						<h1>
							<span className='blue-color'>Balance:</span> <br />
							{balance}
						</h1>
						<Transaction />
					</section>
				) : (
					<button onClick={login}>Login with MetaMask</button>
				)}
			</section>
		</div>
	)
}

export default App
