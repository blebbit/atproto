import { v1 as spice } from '@authzed/authzed-node';

export function createObjectReference(objectType: string) {
  // console.log("createObjectReference", objectType);
  const [objectTypeName, objectId] = objectType.split(":");
  return spice.ObjectReference.create({
    objectType: objectTypeName,
    objectId: objectId,
  });
}

export function createSubjectReference(subjectType: string) {
  var [subjectTypeName, subjectId] = subjectType.split(":");
  var [subjectId, optionalRelation] = subjectId.split("#")

  // console.log("createSubjectReference", subjectTypeName, subjectId, optionalRelation);
  var opts: any = {
    object: spice.ObjectReference.create({
      objectType: subjectTypeName,
      objectId: subjectId,
    }),
  }
  if (optionalRelation) {
    opts.optionalRelation = optionalRelation;
  }
  return spice.SubjectReference.create(opts);
}

export function createSubjectFilter(subjectType: string) {
  var [subjectTypeName, subjectId] = subjectType.split(":");
  var [subjectId, optionalRelation] = subjectId.split("#")
  var opts: any = {
    subjectType: subjectTypeName,
    optionalSubjectId: subjectId || undefined,
  }
  if (optionalRelation) {
    opts.optionalRelation = {
      relation: optionalRelation,
    }
  }
  return spice.SubjectFilter.create(opts);
}

export function createCheckPermissionRequest(objectType: string, permission: string, subjectType: string) {
  // console.log("createCheckPermissionRequest", objectType, permission, subjectType);
  const resource = createObjectReference(objectType);
  const subject = createSubjectReference(subjectType);
  return spice.CheckPermissionRequest.create({
    consistency: spice.Consistency.create({
      requirement: {
        oneofKind: 'fullyConsistent',
        fullyConsistent: true,
      },
    }),
    resource,
    permission,
    subject,
  });
}

export function createRelationshipFilter(objectType?: string, relation?: string, subjectType?: string) {
  // console.log("createRelationshipFilter", objectType, relation, subjectType);
  // @ts-ignore
  const filter: spice.RelationshipFilter = {};
  if (objectType) {
    const parts = objectType.split(":");
    filter.resourceType = parts[0];
    // @ts-ignore
    filter.optionalResourceId = parts[1] || undefined;
  }
  if (relation) {
    filter.optionalRelation = relation;
  }
  if (subjectType) {
    filter.optionalSubjectFilter = createSubjectFilter(subjectType);
  }
  return filter;
}

export function createBulkReference(objectTypes: string[], permission: string, subjectType: string) {
  // console.log("createBulkReference", objectTypes, permission, subjectType);
  const subject = createSubjectReference(subjectType);
  return objectTypes.map((objectType) => {
    const [objectTypeName, objectId] = objectType.split(":");
    const obj = spice.ObjectReference.create({
        objectType: objectTypeName,
        objectId: objectId,
    });
    return spice.BulkCheckPermissionRequestItem.create({
      resource: obj,
      permission,
      subject,
    });
  });
}

export function createBulkCheckPermissionRequest(objectTypes: string[], permission: string, subjectType: string) {
  return spice.BulkCheckPermissionRequest.create({
    items: createBulkReference(objectTypes, permission, subjectType),
    consistency: spice.Consistency.create({
      requirement: {
        oneofKind: 'fullyConsistent',
        fullyConsistent: true,
      },
    }),
  });
}
