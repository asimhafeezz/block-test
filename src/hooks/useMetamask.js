import { useState } from "react"
import { ethers } from "ethers"
export const useMetamask = () => {
	const [error, setError] = useState("")
	const [account, setAccount] = useState("")
	const [loading, setLoading] = useState(false)
	const [balance, setBalance] = useState(0)

	//get balance
	const getBalance = address => {
		window.ethereum
			.request({ method: "eth_getBalance", params: [address, "latest"] })
			.then(balance => {
				setBalance(ethers.utils.formatEther(balance))
				setLoading(false)
				setError("")
				if (address) {
					setAccount(address)
				}
			})
			.catch(err => console.log("getBalance err :: ", err))
	}

	// transfer balance
	const transaction = async (toAddress, balance) => {
		// check if address is valid
		if (!ethers.utils.isAddress(toAddress)) {
			throw new Error("Invalid address")
		}

		try {
			const account = localStorage.getItem("account")

			// provider
			const provider = new ethers.providers.Web3Provider(window.ethereum)

			// signer
			const wallet = provider.getSigner(account)

			// transaction
			const transaction = {
				to: toAddress,
				value: ethers.utils.parseEther(balance),
			}

			// Sign the transaction
			await wallet.sendTransaction(transaction)

			// get balance
			getBalance(account)
		} catch (error) {
			throw error
		}
	}

	//login with meta mask
	const login = () => {
		setLoading(true)
		if (window.ethereum) {
			window.ethereum
				.request({ method: "eth_requestAccounts" })
				.then(accounts => {
					setAccount(accounts[0])
					localStorage.setItem("account", accounts[0])
					getBalance(accounts[0])
				})
				.catch(err => console.log("req acc err :: ", err))
		} else {
			setError("Install MetaMask!!!")
			setLoading(false)
		}
	}

	const logout = () => {
		setAccount("")
		setBalance(0)
		localStorage.removeItem("account")
	}

	return {
		account,
		error,
		loading,
		balance,
		login,
		logout,
		getBalance,
		transaction,
	}
}
