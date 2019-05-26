INSERT INTO polices (id, "fullName")
VALUES (1, 'test1'),
       (2, 'test2'),
       (3, 'test3');

INSERT INTO cases (id, "type", "ownerName", "licenseNumber", "color", "theftDescription", "policeId", "createdAt", "updatedAt")
values (1, 'Mountain', 'owner1', '10ab01', 'black', 'some description 1', 1, now(), now()),
       (2, 'Hybrid', 'owner2', '20ab02', 'white', 'some description 2', 2, now(), now()),
       (3, 'BMX', 'owner3', '30ab03', 'brown', 'some description 3', 3, now(), now()),
       (4, 'Track', 'owner4', '40ab04', 'black-white', 'some description 4', null, now(), now()),
       (5, 'Kids', 'owner5', '50ab05', 'purple', 'some description 5', null, now(), now());
