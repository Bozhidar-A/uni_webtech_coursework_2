export default function Package({ id, address, deliveryPrice, isDelivered, recipientName, HandleUpdateState }) {
    return (
        <div>
            <h2>{recipientName}</h2>
            <p>{address}</p>
            <p>{deliveryPrice}</p>
            <p>{isDelivered.toString()}</p>
            <button onClick={() => HandleUpdateState(id, !isDelivered)}>Update delivery status</button>
        </div>
    )
}