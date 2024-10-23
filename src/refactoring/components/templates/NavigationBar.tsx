interface Props {
  isAdmin: boolean
  onAdminChange: (isAdmin: boolean) => void
}

export const NavigationBar = ({ isAdmin, onAdminChange }: Props) => {
  const toggleAdmin = () => {
    onAdminChange(!isAdmin)
  }

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
        <button
          onClick={toggleAdmin}
          className="rounded bg-white px-4 py-2 text-blue-600 hover:bg-blue-100"
        >
          {isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
        </button>
      </div>
    </nav>
  )
}
