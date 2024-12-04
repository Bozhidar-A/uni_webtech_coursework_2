export default function Package({
    id,
    address,
    deliveryPrice,
    isDelivered,
    recipientName,
    HandleUpdateState
}) {
    return (
        <div id="package_comp_inst" className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">{recipientName}</h2>
                <p className="text-gray-600 text-sm">{address}</p>
                <p className="text-gray-500 text-sm">Delivery Price: ${deliveryPrice}</p>
            </div>
            <div className="flex items-center space-x-2">
                <span id="status_text" className={`px-2 py-1 rounded-full text-xs font-medium ${isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {isDelivered ? 'Delivered' : 'Pending'}
                </span>
                <button
                    id="status_button"
                    onClick={() => HandleUpdateState(id, !isDelivered)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isDelivered
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                >
                    {isDelivered ? 'Mark as Pending' : 'Mark as Delivered'}
                </button>
            </div>
        </div>
    )
}