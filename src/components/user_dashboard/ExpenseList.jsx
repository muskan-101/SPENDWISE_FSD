import "./ExpenseList.css"

function ExpenseList() {

  return (

    <div className="expenseSection">

      <h2>Recent Expenses</h2>

      <table>

        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Admin Remarks</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>Stage Decoration</td>
            <td>₹2000</td>
            <td className="status-approved">Approved</td>
            <td>Looks good</td>
          </tr>

          <tr>
            <td>Printing Posters</td>
            <td>₹850</td>
            <td className="status-rejected">Rejected</td>
            <td>Need original bill</td>
          </tr>

        </tbody>

      </table>

    </div>

  )
}

export default ExpenseList