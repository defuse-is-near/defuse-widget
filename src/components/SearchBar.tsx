import Image from "next/image"

type Props = {
  query: string
  setQuery: (value: string) => void
  placeholder?: string
  handleOverrideCancel?: () => void
}

const SearchBar = ({
  query,
  setQuery,
  handleOverrideCancel,
  placeholder = "Search name or paste address",
}: Props) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <Image
        src="/static/icons/search.svg"
        alt="Search Icon"
        width={18}
        height={18}
      />
      <input
        className="flex-1 border-transparent focus:border-transparent focus:ring-0"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={() => {
          handleOverrideCancel ? handleOverrideCancel() : setQuery("")
        }}
      >
        <Image
          src="/static/icons/close.svg"
          alt="Search Icon"
          width={14}
          height={14}
        />
      </button>
    </div>
  )
}

export default SearchBar
