import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { DocumentCase } from '@/types/cases'


type EditDocumentCaseFormProps = {
    documentCase:DocumentCase
}
const EditDocumentCaseForm:FC<EditDocumentCaseFormProps> = ({documentCase}) => {
  return (
    <View>
      <Text>EditDocumentCaseForm</Text>
    </View>
  )
}

export default EditDocumentCaseForm