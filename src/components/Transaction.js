import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useMetamask } from "../hooks/useMetamask"

const SendTransaction = () => {
	const [toAddress, setToAddress] = useState("")
	const [balance, setBalance] = useState("")
	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState("")

	// useMetaMask hook
	const { transaction } = useMetamask()

	const handleToAddressChange = e => {
		setToAddress(e.target.value)
	}

	const handleBalanceChange = e => {
		setBalance(e.target.value)
	}

	const reset = () => {
		setToAddress("")
		setBalance("")
	}

	const handleSendTransaction = async () => {
		// check both must be filled
		if (!toAddress || !balance) {
			return setStatus("Please fill both fields")
		}

		setLoading(true)
		setStatus("")
		try {
			// send transaction
			await transaction(toAddress, balance)

			// reset values
			setLoading(false)
			reset()
			setStatus("Transaction sent!")
		} catch (error) {
			setLoading(false)
			console.log("error :: ", error)
			setStatus(
				error.message?.slice(0, 18) + " (Error!!!)" ||
					"Error sending transaction"
			)
		}
	}

	// set status to empty string after 5 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setStatus("")
		}, 5000)
		return () => clearTimeout(timer)
	}, [status])

	return (
		<div>
			<h1 className='heading'>Send Transaction</h1>
			<label>
				To Address:
				<input
					disabled={loading}
					type='text'
					value={toAddress}
					onChange={handleToAddressChange}
				/>
			</label>
			<br />
			<label>
				Balance (ETH):
				<input
					disabled={loading}
					type='number'
					value={balance}
					onChange={handleBalanceChange}
				/>
			</label>
			<br />
			<button disabled={loading} onClick={handleSendTransaction}>
				{loading ? "Sending..." : "Send Transaction"}
			</button>
			<br />
			{status && <h3 className='status'>{status}</h3>}
		</div>
	)
}

export default SendTransaction
