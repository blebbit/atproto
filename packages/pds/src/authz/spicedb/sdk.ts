import { v1 as spice } from '@authzed/authzed-node';

import {
  createConsistencyObj,
  createObjectReference,
  createSubjectReference,
  createSubjectFilter,
  createCheckPermissionRequest,
  createBulkCheckPermissionRequest,
  createRelationshipFilter,
} from './utils';

export async function touchRelationship(client: any, objectType: string, relation: string, subjectType: string) {
  const resource = createObjectReference(objectType);
  const subject = createSubjectReference(subjectType);
  const request = spice.WriteRelationshipsRequest.create({
    updates: [{
      operation: spice.RelationshipUpdate_Operation.TOUCH,
      relationship: {
        resource,
        relation,
        subject,
      }
    }]
  });
  return client.writeRelationships(request);
}

export async function createRelationship(client: any, objectType: string, relation: string, subjectType: string) {
  const resource = createObjectReference(objectType);
  const subject = createSubjectReference(subjectType);
  const request = spice.WriteRelationshipsRequest.create({
    updates: [{
      operation: spice.RelationshipUpdate_Operation.CREATE,
      relationship: {
        resource,
        relation,
        subject,
      }
    }]
  });
  return client.writeRelationships(request);
}

export async function deleteRelationship(client: any, objectType?: string, relation?: string, subjectType?: string) {
  const filter = createRelationshipFilter(objectType, relation, subjectType);
  const request = spice.DeleteRelationshipsRequest.create({
    relationshipFilter: filter,
  });
  return client.deleteRelationships(request);
}

export async function putRelationship(client: any, objectType: string, relation: string, subjectType: string) {
  // delete any existing relationship first, assume only one relationship exists for the given objectType, relation, and subjectType
  await deleteRelationship(client, objectType, undefined, subjectType);
  return createRelationship(client, objectType, relation, subjectType);
}


export async function lookupResources(client: any, zookie: string, subjectType: string, permission?: string, objectType?: string) {

  const request = spice.LookupResourcesRequest.create({
    subject: createSubjectReference(subjectType),
    permission,
    resourceObjectType: objectType,
    consistency: createConsistencyObj(zookie),
  })

  return client.lookupResources(request);
}

export async function lookupSubjects(client: any, zookie: string, objectType: string, permission?: string, subjectType?: string) {

  // @ts-ignore
  const payload: spice.LookupSubjectsRequest = {
    resource: createObjectReference(objectType),
    consistency: createConsistencyObj(zookie),
  }

  if (permission) {
    payload.permission = permission;
  }
  if (subjectType) {
    payload.subjectObjectType = subjectType.split(":")[0];
  }

  const request = spice.LookupSubjectsRequest.create(payload)

  return client.lookupSubjects(request);
}

export async function getRelationship(client: any, zookie: string, objectType?: string, relation?: string, subjectType?: string) {

  const request = spice.ReadRelationshipsRequest.create({
    relationshipFilter: createRelationshipFilter(objectType, relation, subjectType),
    consistency: createConsistencyObj(zookie),
  })

  return client.readRelationships(request);
}

export async function checkPermission(client: spice.ZedPromiseClientInterface, zookie: string, objectType: string, permission: string, subjectType: string) {
  const checkPermissionRequest = createCheckPermissionRequest(objectType, permission, subjectType, zookie);
  console.log("checkPermissionRequest", checkPermissionRequest);
  const response = await client.checkPermission(checkPermissionRequest);
  console.log("checkPermission", response);
  return {
    ...permissionResponseToAllowed(response?.permissionship),
    checkedAt: response.checkedAt?.token
  }
}

export async function checkBulkPermission(client: spice.ZedPromiseClientInterface, zookie: string, objectTypes: string[], permission: string, subjectType: string) {
  const checkPermissionRequest = createBulkCheckPermissionRequest(objectTypes, permission, subjectType, zookie);
  console.log("checkBulkPermissionRequest", checkPermissionRequest);
  const response = await client.bulkCheckPermission(checkPermissionRequest);
  console.log("checkBulkPermission", response);

  // TODO clean up the response a bit to make it a simpler object for devs to handle
  //      need to map over the response entries and build a mapping the caller can use
  //      iirc, spicedb keeps alignment by array index, so we can keep that for now, can we do better?
  return response;
}

function permissionResponseToAllowed(perm: spice.CheckPermissionResponse_Permissionship) {
  if (perm === spice.CheckPermissionResponse_Permissionship.HAS_PERMISSION) {
    return { allowed: "yes" };
  } else if (perm === spice.CheckPermissionResponse_Permissionship.NO_PERMISSION) {
    return { allowed: "no" };
  } else if (perm === spice.CheckPermissionResponse_Permissionship.CONDITIONAL_PERMISSION) {
    return { allowed: "conditional" };
  } else if (perm === spice.CheckPermissionResponse_Permissionship.UNSPECIFIED) {
    return { allowed: "unspecified" };
  } else {
    return { allowed: "unknown" };
  }
}
