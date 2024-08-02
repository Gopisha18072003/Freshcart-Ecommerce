import { Rating } from "primereact/rating";
export default function Review({review}) {
    return (
        <div className="flex bg-white shadow-lg rounded-lg shadow-green-100 p-4 items-center gap-6 max-w-[18rem]">
                    <img
                      src={`https://freshcart-ut38.onrender.com/${review.user.image}`}
                      alt="profile photo"
                      crossOrigin="anonymous"
                      className="w-[4rem] h-[4rem] rounded-full relative object-cover"
                    />
                    <div className="flex flex-col ">
                        <h1 className="poppins-bold">{review.user.name}</h1>
                        <p className="poppins-semibold text-[0.8rem] text-gray-500">{review.comment}</p>
                        <Rating value={review.rating} readOnly cancel={false} className="mt-4"/>
                    </div> 
        </div>
    )
}