function ExpenseDashboard({expenses, openDetail}){

  return(
    <div className="expenseDashboard">

      <h2>My Submitted Expenses</h2>

      {expenses.map((exp,index)=>(
        <div className="expenseRow" key={index}>

          <p>{exp.event}</p>
          <p>{exp.category}</p>
          <p>₹{exp.amount}</p>
          <p>{exp.status}</p>

          <button onClick={()=>openDetail(exp)}>
            View Details
          </button>

        </div>
      ))}

    </div>
  )

}
export default ExpenseDashboard