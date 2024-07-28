export default function Input({label, type, name, id, value, placeholder, className, length, onChange, required}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="poppins-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        className={`border-2 rounded-md poppins-regular ${className} p-2`}
        id={id}
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        maxLength={length}
        onChange={onChange}
        required = {required}
      />
    </div>
  );
}
