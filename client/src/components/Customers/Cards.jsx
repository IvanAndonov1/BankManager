
export default function Card({
  className = "",
  fromColor = "#A5438B", 
  toColor = "#0B82BE",   
  textColor = "text-white",
  textSize = "text-sm",
  rounded = "rounded-2xl",
  shadow = "shadow-xl",
  iban = "**** **** **** 0000",
  expiration = "08/26",
  cardType = "Debit Visa",
  logoSize = "w-8 h-6",
  size = "p-6", 
  children,    
}) {
  return (
    <div
      className={`${rounded} ${shadow} ${textColor} relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
      }}
    >
      <div className={`${size} flex flex-col justify-between`}>
      
        {children ? (
          children
        ) : (
          <>
            <div className="flex justify-between items-start"></div>

            <div className="flex justify-between items-end mt-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                alt="card network"
                className={logoSize}
              />
            </div>

            <div className="mt-4 space-y-1">
              <p className={`tracking-widest ${textSize}`} >{iban}</p>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div>
                <p className={`font-light {textSize}`}>{cardType}</p>
              </div>
              <p className={`${textSize} opacity-80`}>EXP {expiration}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

