import visa from "../../assets/visa.svg";
import mastercard from "../../assets/mastercard.svg";

export default function Cards({
  className = "",
  fromColor = "#A5438B",
  toColor = "#0B82BE",
  textColor = "text-white",
  textSize = "text-sm",
  rounded = "rounded-2xl",
  shadow = "shadow-xl",
  cardNumber = "**** **** **** 0000",
  expiration = "08/26",
  cardType = "Debit Visa",
  logoSize = "w-12 h-6",
  size = "py-6 px-6",
  width = "w-80",   
  height = "h-48", 
  margin = "mt-8",
  children,
}) {
  return (
    <div
      className={`${rounded} ${shadow} ${textColor} ${width} ${height} relative ${className}`}
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
      }}
    >
      <div className={`${size} flex flex-col justify-between`}>
        {children ? (
          children
        ) : (
          <>
           

            <div className="flex justify-between items-end">
              <img
                src={
                  cardType.includes("Visa")
                    ? visa
                    : mastercard
                }
                alt="card network"
                className={logoSize}
              />
            </div>

            <div className="mt-4 space-y-1">
              <p className={`tracking-widest ${textSize} ${margin}`}>{cardNumber}</p>
            </div>

            <div className={`flex justify-between items-end ${margin}`}>
              <div>
                <p className={`font-light ${textSize}`}>{cardType}</p>
              </div>
              <p className={`${textSize} opacity-80`}>EXP {expiration}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
