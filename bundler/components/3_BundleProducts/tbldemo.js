const { useState } = React,
      { render } = ReactDOM,
      { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, Button, TextField, FormGroup } = MaterialUI
      
const srcData = [{id:0, author: 'Author1', title: 'Post 1', description: 'Some description'},{id:1, author: 'Author2', title: 'Post 2', description: 'Some other description'},{id:2, author: 'Author3', title: 'Post 3', description: 'Something else'}],
      dataFields = [{id: 0, title: 'Author', key: 'author'},{id: 1, title: 'Title', key: 'title'},{id:2, title: 'Description', key: 'description'}]

const EditButton = ({handleClick}) => (
  <IconButton onClick={handleClick} >
    <i className="material-icons">create</i>
  </IconButton>
)

const DeleteButton = ({handleClick}) => (
  <IconButton onClick={handleClick} >
    <i className="material-icons">delete</i>
  </IconButton>
)
      
const DeleteDialog = ({isOpen, onDialogClose, onConfirmDelete, recordId}) => (
  <Dialog open={isOpen} onClose={onDialogClose} >
    <DialogTitle>Delete record</DialogTitle>
    <DialogContent>
      <DialogContentText>Are you sure you want to delete this record?</DialogContentText>
      <FormGroup>
        <Button onClick={() => onConfirmDelete(recordId)}>Yes</Button>
        <Button onClick={onDialogClose}>No</Button>
      </FormGroup>
    </DialogContent>
  </Dialog>
)

const EditDialog = ({isOpen, onDialogClose, onSubmitEdit, recordData, fields}) => {
  const [data, setData] = useState(),
        handleEdit = (key,value) => setData({...data, [key]:value})
  return (
    <Dialog open={isOpen} onClose={onDialogClose} >
      <DialogTitle>Edit record</DialogTitle>
      <DialogContent>
        <FormGroup>
          {
            fields.map(({key,title}) => (
              <TextField
                key={key}
                defaultValue={recordData[key]}
                label={title}
                onChange={({target:{value}}) => handleEdit(key,value)}
              />
            ))
          }
        </FormGroup>
        <FormGroup>
          <Button onClick={() => onSubmitEdit({...recordData,...data})}>Submit</Button>
          <Button onClick={() => onDialogClose()}>Cancel</Button>
        </FormGroup>
      </DialogContent>
    </Dialog>
  )
}

const Header = ({columnTitles}) => (
  <TableHead>
    <TableRow>
      {columnTitles.map(({title,id}) => <TableCell key={id}>{title}</TableCell>)}
      <TableCell>Action</TableCell>
    </TableRow>
  </TableHead>
)

const Row = ({rowData, columns, onEdit, onDelete}) => (
  <TableRow>
    {columns.map(({key}, i) => <TableCell key={i}>{rowData[key]}</TableCell>)}
    <TableCell>
      <EditButton handleClick={() => onEdit(rowData.id)} /> 
      <DeleteButton handleClick={() => onDelete(rowData.id)} />
    </TableCell>
  </TableRow>
)

const App = ({data,fields}) => {
  const [tableData, setTableData] = useState(data),
        [dataFields, setDataFields] = useState(fields),
        [deleteDialogOn, setDeleteDialogOn] = useState(false),
        [editDialogOn, setEditDialogOn] = useState(false),
        [recordIdToDelete, setRecordIdToDelete] = useState(),
        [recordIdToEdit, setRecordIdToEdit] = useState(),
        onEditDialogOpen = (id) => (setRecordIdToEdit(id),setEditDialogOn(true)),
        onDeleteDialogOpen = (id) => (setRecordIdToDelete(id), setDeleteDialogOn(true)),
        handleEdit = (data) => {
          setEditDialogOn(false)
          const tableDataCopy = [...tableData],
                editedItemIdx = tableDataCopy.findIndex(({id}) => id == data.id)
                tableDataCopy.splice(editedItemIdx,1,data)
          setTableData(tableDataCopy)
        },
        handleDelete = (idRecordToDelete) => {
          setDeleteDialogOn(false)
          const tableDataCopy = [...tableData]
          setTableData(tableDataCopy.filter(({id}) => id!=recordIdToDelete))
        }
  return (
    <div>
    <DeleteDialog 
      isOpen={deleteDialogOn} 
      onDialogClose={() => setDeleteDialogOn(false)}
      onConfirmDelete={handleDelete}
      recordId={recordIdToDelete}
    />
    <EditDialog 
      isOpen={editDialogOn} 
      onDialogClose={() => setEditDialogOn(false)}
      onSubmitEdit={handleEdit}
      recordData={tableData.find(({id}) => id==recordIdToEdit)||{}}
      fields={dataFields}
    />
    <TableContainer>
    <Table>
        <Header columnTitles={dataFields} /> 
      <TableBody>
        {
          tableData.map(data => (
            <Row 
              key={data.id} 
              rowData={data}
              columns={dataFields}
              onEdit={onEditDialogOpen}
              onDelete={onDeleteDialogOpen}
            />
          ))
        }
      </TableBody>
    </Table>
    </TableContainer>
    </div>
  )
}

render (
  <App data={srcData} fields={dataFields} />,
  document.getElementById('root')
)